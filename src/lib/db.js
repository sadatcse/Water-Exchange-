// MariaDB / MySQL connection (cPanel → MySQL Databases). Settings from .env:
//   DB_HOST (default localhost), DB_PORT (3306), DB_USER, DB_PASSWORD, DB_NAME
// The first connect of each server process creates any missing tables/columns (src/lib/schema.js) and, once,
// imports mongo-export.json from the old MongoDB database (scripts/export-mongo.mjs) into empty tables.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import mysql from 'mysql2/promise';
import { TABLES, createTableSql } from './schema.js';

const state = global.__mariadb || (global.__mariadb = { pool: null, ready: null, loggedAt: 0 });

function getPool() {
  if (state.pool) return state.pool;
  const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER, DB_PASSWORD = '', DB_NAME } = process.env;
  if (!DB_USER || !DB_NAME) throw new Error('DB_USER / DB_NAME are not set in .env');
  state.pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    charset: 'utf8mb4',
    timezone: 'Z', // DATETIME columns hold UTC
    // Small pool suits shared hosting (cPanel may run several app processes)
    connectionLimit: 5,
    connectTimeout: 10000,
    enableKeepAlive: true,
  });
  return state.pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

// 24 hex characters like a MongoDB ObjectId: creation second + random
export function newId() {
  const time = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  return time + crypto.randomBytes(8).toString('hex');
}

async function syncTables(conn) {
  for (const name of Object.keys(TABLES)) {
    await conn.query(createTableSql(name));
    const existing = new Set((await conn.query(`SHOW COLUMNS FROM \`${name}\``))[0].map((c) => c.Field));
    for (const [col, def] of Object.entries(TABLES[name].columns)) {
      if (!existing.has(col)) await conn.query(`ALTER TABLE \`${name}\` ADD COLUMN \`${col}\` ${def.sql}`);
    }
  }
}

// ---------- one-time import from MongoDB ----------

// The ignore comments keep Next's file tracing from copying the project into the build (path known at runtime)
const importFile = () => path.resolve(/* turbopackIgnore: true */ process.env.DATA_IMPORT_FILE || path.join(/* turbopackIgnore: true */ process.cwd(), 'mongo-export.json'));

// Exported document → row values in column order (nested subdocument ids dropped)
function importRow(name, doc) {
  const stripIds = (v) => (Array.isArray(v) ? v.map(stripIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== '_id').map(([k, x]) => [k, stripIds(x)])) : v);
  const cols = TABLES[name].columns;
  const values = Object.entries(cols).map(([col, def]) => {
    const v = doc[col];
    if (def.kind === 'json') return JSON.stringify(stripIds(v ?? def.fallback));
    if (def.kind === 'bool') return (v === undefined ? def.fallback : v) ? 1 : 0;
    if (def.kind === 'date') return v ? new Date(v) : col === 'createdAt' ? new Date() : null;
    if (def.kind === 'num') return Number(v) || 0;
    if (def.kind === 'ref') return v ? String(v) : null;
    return v === undefined || v === null ? (def.kind === 'text' ? null : '') : String(v);
  });
  return [String(doc._id), ...values];
}

async function importFromMongo(conn) {
  const file = importFile();
  if (!fs.existsSync(file)) return;
  const { tables = {} } = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [name, docs] of Object.entries(tables)) {
    if (!TABLES[name] || !docs.length) continue;
    const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM \`${name}\``);
    if (n > 0) continue; // never mix into a table that already has data
    const cols = ['id', ...Object.keys(TABLES[name].columns)];
    const rows = docs.map((d) => importRow(name, d));
    await conn.query(`INSERT IGNORE INTO \`${name}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES ?`, [rows]);
    console.log(`Imported ${rows.length} row(s) into ${name}`);
  }
  // Renamed so it is not imported again (a failed rename only means the empty-table check above skips it)
  fs.renameSync(file, file.replace(/\.json$/, `.imported-${Date.now()}.json`));
}

async function setup() {
  const conn = await getPool().getConnection();
  try {
    // Several app processes may start together — only one sets up at a time
    await conn.query("SELECT GET_LOCK('water_exchange_setup', 60)");
    await syncTables(conn);
    await importFromMongo(conn);
  } finally {
    await conn.query("SELECT RELEASE_LOCK('water_exchange_setup')").catch(() => {});
    conn.release();
  }
}

export default async function connectDB() {
  if (!state.ready) state.ready = setup();
  try {
    await state.ready;
  } catch (e) {
    state.ready = null;
    // Log the real reason once a minute (e.g. ER_ACCESS_DENIED_ERROR = wrong user/password)
    if (Date.now() - state.loggedAt > 60000) {
      state.loggedAt = Date.now();
      console.error(`Database connection failed — ${e.code || ''} ${e.message}`);
    }
    throw e;
  }
}

// Scripts (create-admin, seed) close the pool so Node can exit
export async function closeDB() {
  await state.pool?.end();
  state.pool = null;
  state.ready = null;
}
