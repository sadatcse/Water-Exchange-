// Builds an upload-ready package for cPanel ("Setup Node.js App" / Passenger). See DEPLOY-CPANEL.md.
//   npm run build:cpanel                         → uses https://waterexchangebd.com
//   npm run build:cpanel -- https://example.com  → another domain
//
// Output: cpanel-build/            (upload the contents to the Node.js app root)
//           app.js                 ← "Application startup file" in cPanel
//           .env                   ← production settings (secrets — never share this file)
//           site/                  ← the self-contained Next.js server (.next/standalone)
//         water-exchange-cpanel.tar.gz
//
// The server lives in site/ because cPanel's Node.js selector puts its own `node_modules` symlink in the
// app root and refuses to start if a real node_modules folder is there.
//
// npm run build:cpanel-npm [-- https://example.com]  → package for "Run NPM Install" in cPanel instead:
//   cpanel-npm-build/  app.js, package.json (dependencies only), package-lock.json, .next/, public/,
//                      next.config.mjs — no .env, the settings go in Setup Node.js App → Environment variables
//   water-exchange-cpanel-npm.tar.gz
//
// npm run build:cpanel-env [-- https://example.com]  → the same, plus a .env with the settings from this
//   computer's .env (no Environment variables needed in cPanel; the .env wins over any that are set)
//   cpanel-env-build/, water-exchange-cpanel-env.zip and water-exchange-cpanel-env.tar.gz
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const withEnv = args.includes('--env');
const npmMode = withEnv || args.includes('--npm');
const siteUrl = (args.find((a) => !a.startsWith('--')) || 'https://waterexchangebd.com').replace(/\/+$/, '');
const name = withEnv ? 'cpanel-env' : npmMode ? 'cpanel-npm' : 'cpanel';
const out = path.join(root, `${name}-build`);
const zip = path.join(root, `water-exchange-${name}.tar.gz`);

// Settings the site cannot run without (DB_HOST defaults to localhost, DB_PASSWORD may be empty)
const REQUIRED_ENV = ['DB_USER', 'DB_NAME', 'JWT_SECRET', 'SETTINGS_SECRET', 'CRON_SECRET'];
// One-time data from MongoDB (npm run export-mongo) — imported into the empty MariaDB tables on first start
const exportFile = path.join(root, 'mongo-export.json');

const step = (msg) => console.log(`\n▸ ${msg}`);
const copy = (from, to) => fs.cpSync(from, to, { recursive: true, dereference: true });

// Simple KEY=value reader for .env (no expansion, quotes stripped)
function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((l) => /^\s*[A-Z0-9_]+\s*=/.test(l))
      .map((l) => {
        const at = l.indexOf('=');
        return [l.slice(0, at).trim(), l.slice(at + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
      })
  );
}

const env = readEnv(path.join(root, '.env'));
for (const key of npmMode && !withEnv ? [] : REQUIRED_ENV) {
  if (!env[key]) {
    console.error(`✖ ${key} is missing in .env — add it before building.`);
    process.exit(1);
  }
}

step(`Building for ${siteUrl}`);
execSync('npx next build', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl, NODE_ENV: 'production', ...(npmMode && { NEXT_OUTPUT: 'default' }) },
});

if (npmMode) {
  buildNpmPackage();
  process.exit(0);
}

const standalone = path.join(root, '.next', 'standalone');
if (!fs.existsSync(path.join(standalone, 'server.js'))) {
  console.error('✖ .next/standalone/server.js was not created — is output: "standalone" set in next.config.mjs?');
  process.exit(1);
}

step('Assembling cpanel-build/');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
const site = path.join(out, 'site');
copy(standalone, site);
copy(path.join(root, 'public'), path.join(site, 'public'));
copy(path.join(root, '.next', 'static'), path.join(site, '.next', 'static'));
// The build machine's .env must not leak into the bundle; the app root .env below is the only one
for (const f of ['.env', '.env.local', '.env.production']) fs.rmSync(path.join(site, f), { force: true });

fs.writeFileSync(
  path.join(out, 'app.js'),
  `// cPanel / Passenger startup file — loads .env, then starts the Next.js server in ./site
const fs = require('node:fs');
const path = require('node:path');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  if (typeof process.loadEnvFile === 'function') process.loadEnvFile(envFile);
  else
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\\r?\\n/)) {
      const m = line.match(/^\\s*([A-Z0-9_]+)\\s*=\\s*(.*)\\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\\1$/, '$2');
    }
}
process.env.NODE_ENV = 'production';
// Dashboard uploads live next to app.js, outside site/, so replacing site/ on an update keeps them
process.env.UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
fs.mkdirSync(process.env.UPLOAD_DIR, { recursive: true });
require('./site/server.js');
`
);

// Database connection checker — run in cPanel → Terminal: node check-db.js
fs.writeFileSync(path.join(out, 'check-db.js'), checkDbSource('./site/node_modules/mysql2/promise'));

// app.js is CommonJS; no dependencies are listed, so cPanel's "Run NPM Install" has nothing to do
fs.writeFileSync(
  path.join(out, 'package.json'),
  `${JSON.stringify({ name: 'water-exchange', private: true, type: 'commonjs', main: 'app.js', scripts: { start: 'node app.js' }, engines: { node: '>=20.9.0' } }, null, 2)}\n`
);

writeEnvFile();

finish(['app.js', 'check-db.js', 'package.json', '.env', 'site']);

function writeEnvFile() {
  fs.writeFileSync(
    path.join(out, '.env'),
    [
      '# Production settings for cPanel — keep this file private.',
      '# MariaDB (cPanel → MySQL Databases); the site runs on the same server, so the host is localhost',
      `DB_HOST=${env.DB_HOST || 'localhost'}`,
      `DB_PORT=${env.DB_PORT || '3306'}`,
      `DB_USER=${env.DB_USER}`,
      `DB_PASSWORD="${env.DB_PASSWORD || ''}"`,
      `DB_NAME=${env.DB_NAME}`,
      `JWT_SECRET=${env.JWT_SECRET}`,
      `JWT_EXPIRES_IN=${env.JWT_EXPIRES_IN || '7d'}`,
      '# Encrypts the SMTP password saved in Settings — do not change it, or re-enter the password after changing',
      `SETTINGS_SECRET=${env.SETTINGS_SECRET}`,
      '# Key for the daily report cron job (/api/cron/reports?key=…)',
      `CRON_SECRET=${env.CRON_SECRET}`,
      `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
      '',
    ].join('\n')
  );
}

// Plain .next build + package.json with the real dependencies — cPanel's "Run NPM Install" fills node_modules
function buildNpmPackage() {
  if (!fs.existsSync(path.join(root, '.next', 'BUILD_ID'))) {
    console.error('✖ .next/BUILD_ID was not created — the build failed.');
    process.exit(1);
  }

  step(`Assembling ${path.basename(out)}/`);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out);
  // Build cache, standalone output and dev-only files aren't needed to run the site
  const skip = new Set(['cache', 'standalone', 'dev', 'trace', 'trace-build', 'diagnostics']);
  fs.cpSync(path.join(root, '.next'), path.join(out, '.next'), {
    recursive: true,
    dereference: true,
    filter: (src) => !skip.has(path.relative(path.join(root, '.next'), src).split(path.sep)[0]),
  });
  copy(path.join(root, 'public'), path.join(out, 'public'));
  // next() reads the config at startup (and checks that a custom image loader file exists). The project is
  // "type": "module", the package is CommonJS — so the config goes in as .mjs to stay an ES module.
  const config = ['next.config.mjs', 'next.config.js'].find((f) => fs.existsSync(path.join(root, f)));
  if (!config) {
    console.error('✖ next.config.mjs / next.config.js not found.');
    process.exit(1);
  }
  copy(path.join(root, config), path.join(out, 'next.config.mjs'));
  const loader = path.join(root, 'src', 'lib', 'image-loader.js');
  if (fs.existsSync(loader)) copy(loader, path.join(out, 'src', 'lib', 'image-loader.js'));

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  fs.writeFileSync(
    path.join(out, 'package.json'),
    `${JSON.stringify(
      {
        name: pkg.name,
        version: pkg.version,
        private: true,
        type: 'commonjs',
        main: 'app.js',
        scripts: { start: 'node app.js' },
        dependencies: pkg.dependencies,
        engines: pkg.engines,
      },
      null,
      2
    )}\n`
  );
  // Same package versions as on this computer (npm drops the devDependencies from it on install)
  copy(path.join(root, 'package-lock.json'), path.join(out, 'package-lock.json'));
  // Shared hosting caps open connections, so npm's parallel downloads get cut off (ECONNRESET) — fewer
  // sockets and patient retries. cPanel's "Run NPM Install" reads this file from the app root.
  fs.writeFileSync(
    path.join(out, '.npmrc'),
    ['maxsockets=2', 'fetch-retries=6', 'fetch-retry-mintimeout=20000', 'fetch-retry-maxtimeout=120000', 'fetch-timeout=600000', 'omit=dev', 'audit=false', 'fund=false', 'update-notifier=false', ''].join('\n')
  );

  fs.writeFileSync(
    path.join(out, 'app.js'),
    `// cPanel / Passenger startup file — starts the Next.js server from ./.next
${
      withEnv
        ? `// Settings come from the .env next to this file; they win over Setup Node.js App → Environment variables`
        : `// Settings (DB_USER, JWT_SECRET, …) come from Setup Node.js App → Environment variables; a .env file next
// to this one is read too, without overriding those.`
    }
const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('node:http');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile))
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\\r?\\n/)) {
    const m = line.match(/^\\s*([A-Z0-9_]+)\\s*=\\s*(.*)\\s*$/);
    if (m${withEnv ? '' : ' && process.env[m[1]] === undefined'}) process.env[m[1]] = m[2].replace(/^(['"])(.*)\\1$/, '$2');
  }
process.env.NODE_ENV = 'production';
process.env.NEXT_OUTPUT = 'default';
// Dashboard uploads live next to app.js, outside .next, so replacing .next on an update keeps them
process.env.UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
fs.mkdirSync(process.env.UPLOAD_DIR, { recursive: true });
// Data from the old MongoDB database, imported once into the empty tables (then renamed .imported-…)
process.env.DATA_IMPORT_FILE = path.join(__dirname, 'mongo-export.json');

for (const key of ${JSON.stringify(REQUIRED_ENV)})
  if (!process.env[key]) console.error('✖ ' + key + ' is not set — add it to .env or Setup Node.js App → Environment variables');

const next = require('next');
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();
// Passenger passes PORT (sometimes a socket path, so it isn't parsed as a number)
const port = process.env.PORT || 3000;
app
  .prepare()
  .then(() => createServer((req, res) => handle(req, res)).listen(port, () => console.log('> Ready on ' + port)))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
`
  );
  fs.writeFileSync(path.join(out, 'check-db.js'), checkDbSource('mysql2/promise'));
  if (withEnv) writeEnvFile();
  // --no-data once the MongoDB data is already in MariaDB (the file holds password hashes)
  const withData = !args.includes('--no-data') && fs.existsSync(exportFile);
  if (withData) copy(exportFile, path.join(out, 'mongo-export.json'));

  finish([
    'app.js',
    'check-db.js',
    'package.json',
    'package-lock.json',
    '.npmrc',
    ...(withEnv ? ['.env'] : []),
    ...(withData ? ['mongo-export.json'] : []),
    'next.config.mjs',
    ...(fs.existsSync(path.join(out, 'src')) ? ['src'] : []),
    'public',
    '.next',
  ]);
}

function finish(entries) {
  // Windows can fall back to directory junctions in standalone output; those break once uploaded
  const links = [];
  (function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) links.push(path.relative(out, p));
      else if (entry.isDirectory()) scan(p);
    }
  })(out);
  if (links.length) console.warn(`⚠ Symlinks left in the package (copy them as real folders):\n  ${links.join('\n  ')}`);

  step(`Creating ${path.basename(zip)}`);
  fs.rmSync(zip, { force: true });
  try {
    // .tar.gz, not .zip: hosting virus scanners (Sanesecurity Foxhole.JS_Zip) reject any zip that holds .js files.
    // Windows' own bsdtar (Git's GNU tar reads "F:" as a remote host); cPanel File Manager extracts .tar.gz
    const tar = process.platform === 'win32' ? `"${path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe')}"` : 'tar';
    execSync(`${tar} -czf "${path.relative(out, zip)}" ${entries.join(' ')}`, { cwd: out, stdio: 'inherit' });
    // A .zip as well — upload the .tar.gz instead if the host's scanner rejects it
    if (npmMode) {
      const asZip = zip.replace(/\.tar\.gz$/, '.zip');
      fs.rmSync(asZip, { force: true });
      execSync(`${tar} -a -cf "${path.relative(out, asZip)}" ${entries.join(' ')}`, { cwd: out, stdio: 'inherit' });
    }
  } catch {
    console.warn(`⚠ Could not create the archive — upload the ${path.basename(out)} folder contents instead.`);
  }

  const size = (p) => {
    let total = 0;
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walk(f);
        else total += fs.statSync(f).size;
      }
    })(p);
    return `${(total / 1024 / 1024).toFixed(1)} MB`;
  };
  console.log(`\n✔ Ready: ${path.basename(out)}/ (${size(out)})${fs.existsSync(zip) ? ` and ${path.basename(zip)} (${(fs.statSync(zip).size / 1024 / 1024).toFixed(1)} MB)` : ''}`);
  console.log('  Next: follow DEPLOY-CPANEL.md');
}

function checkDbSource(mysqlPath) {
  return `// Checks that the website can sign in to its MariaDB database. In cPanel → Terminal, inside the app folder:
//   node check-db.js
const fs = require('node:fs');
const path = require('node:path');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile))
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\\r?\\n/)) {
    const m = line.match(/^\\s*([A-Z0-9_]+)\\s*=\\s*(.*)\\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^(['"])(.*)\\1$/, '$2');
  }
const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER, DB_PASSWORD = '', DB_NAME } = process.env;
if (!DB_USER || !DB_NAME) {
  console.log('✖ DB_USER / DB_NAME are not set — add them to .env (or Setup Node.js App → Environment variables).');
  process.exit(1);
}

(async () => {
  const mysql = require('${mysqlPath}');
  let conn;
  try {
    conn = await mysql.createConnection({ host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: DB_NAME, connectTimeout: 10000 });
    const [[row]] = await conn.query('SELECT VERSION() AS version, CURRENT_USER() AS user');
    const [tables] = await conn.query('SHOW TABLES');
    console.log('✔ Signed in as', row.user, '—', row.version);
    console.log('  ' + tables.length + ' table(s) in ' + DB_NAME + (tables.length ? '' : ' (the website creates them on its first start)'));
    for (const t of tables) {
      const name = Object.values(t)[0];
      const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM \`' + name + '\`');
      console.log('   ', name + ':', n);
    }
  } catch (e) {
    console.log('✖', e.code || '', e.message);
    if (e.code === 'ER_ACCESS_DENIED_ERROR') console.log('  → wrong DB_USER / DB_PASSWORD (cPanel → MySQL Databases)');
    if (e.code === 'ER_DBACCESS_DENIED_ERROR') console.log('  → add the user to the database: MySQL Databases → Add User To Database → ALL PRIVILEGES');
    if (e.code === 'ER_BAD_DB_ERROR') console.log('  → DB_NAME does not exist (cPanel → MySQL Databases)');
    process.exit(1);
  } finally {
    await conn?.end().catch(() => {});
  }
})();
`;
}
