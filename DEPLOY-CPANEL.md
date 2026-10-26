# Deploying to cPanel

The site runs as a **Node.js app** in cPanel (“Setup Node.js App”). You build a ready-to-run package on your computer, upload one zip, and start it — no `npm install` on the server.

## 1. Before you start (once)

1. **Node.js version** — in cPanel → *Setup Node.js App*, the server must offer **Node 20 or 22** (Next.js 16 needs 20.9+).
2. **MongoDB Atlas** — Atlas → *Network Access* → **Add IP Address** → add your cPanel server’s IP (shown in cPanel → *Server Information* → “Shared IP Address”). Without this the site can’t reach the database.
3. **SSL** — cPanel → *SSL/TLS Status* → run AutoSSL for the domain, then *Domains* → turn on **Force HTTPS Redirect**. Sign-in only works over HTTPS.

## 2. Build the package (on your computer)

In the project folder run **one** of these (they do the same thing):

```bash
npm run cpanel
```

- or double-click **`build-cpanel.bat`** in the project folder (Windows)
- or `npm run build:cpanel`

This creates `water-exchange-cpanel.zip` (≈ 10 MB) and the same files in `cpanel-build/`:

| File      | What it is                                                               |
| --------- | ------------------------------------------------------------------------ |
| `app.js`  | The startup file cPanel runs                                             |
| `.env`    | Database, secrets and site URL — **private, never share or commit it**   |
| `site/`   | The website server, already built                                       |

On the server an **`uploads/`** folder is created next to `app.js` for images uploaded from the dashboard (Media library). It is not part of the zip.

The site URL is `https://waterexchangebd.com`. For another domain: `npm run build:cpanel -- https://example.com`.

## 3. Create the app in cPanel (first time)

1. cPanel → **Setup Node.js App** → **Create Application**
   - **Node.js version:** 20.x or 22.x (the highest offered)
   - **Application mode:** Production
   - **Application root:** `waterexchange` (any folder name, outside `public_html`)
   - **Application URL:** `waterexchangebd.com`
   - **Application startup file:** `app.js`
2. Click **Create**, then **Stop App**.
3. cPanel → **File Manager** → open the `waterexchange` folder → **Settings** (top right) → tick **Show Hidden Files**.
4. Delete the sample files cPanel created there (`app.js`, `public`, `tmp` — **not** the `node_modules` link).
5. **Upload** `water-exchange-cpanel.zip`, right-click → **Extract** into the same folder, then delete the zip.
   You should now see `app.js`, `package.json`, `.env` and `site/`.
6. Back in **Setup Node.js App** → **Start App** (or **Restart**). Open the site.

> Don’t press “Run NPM Install” — it isn’t needed (and does nothing for this package).

## 4. After the site is live

1. **Sign in:** `https://waterexchangebd.com/admin` (this address isn’t linked anywhere on the site).
2. **Email:** Dashboard → Settings → **Email & reports** → **Send a test email**. The SMTP account (`mail.waterexchangebd.com`, port 465, SSL) is already saved.
   If it fails with a connection error, try port **587** with *Use SSL* off.
3. **Reports — cron job:** copy the command shown under *Automatic sending (cPanel cron job)*, then cPanel → **Cron Jobs** → *Add New Cron Job* → **Once Per Day** (e.g. minute `0`, hour `8`) → paste the command → **Add**.
   It sends the weekly report on Mondays and the monthly report on the 1st, each exactly once.
4. **Google:** Settings → **SEO** → follow the Google Search Console steps, then submit `https://waterexchangebd.com/sitemap.xml`. Do the same in Bing Webmaster Tools.
5. **Traffic check:** visit the site from your phone, then open Dashboard → Traffic Analytics. You should see your real IP and country. If every visit shows the same server IP, ask your host to pass the `X-Forwarded-For` header to Node.js apps.

## 5. Updating the site later

1. On your computer: `npm run build:cpanel`
2. cPanel → Setup Node.js App → **Stop App**
3. File Manager → in `waterexchange`, **delete the `site` folder** (old build files must not mix with new ones).
   **Never delete the `uploads` folder** — it holds every image uploaded from the dashboard.
4. Upload the new zip → Extract → when asked, overwrite. Keep the server’s `.env` if you changed it there.
5. **Start App**

Content (products, blog, team, clients, messages, settings) lives in MongoDB and uploaded images live in `uploads/`, so updating the code never touches them. Back up `uploads/` with cPanel’s *Backup* tool from time to time.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| “Incomplete response” / 503 | Open `stderr.log` in the app folder. Usually the Node version is below 20, or `.env` is missing (Show Hidden Files). |
| Pages error, log says `MongoServerSelectionError` | Add the server IP in MongoDB Atlas → Network Access. |
| Can’t stay signed in | The site must be opened over **https://**. |
| Changed `.env` | Restart the app in Setup Node.js App. |
| Upload fails with “413” or “Request Entity Too Large” | Ask your host to allow uploads of at least 6 MB for the domain (Apache `LimitRequestBody`). |
| Saved SMTP password stopped working | `SETTINGS_SECRET` in `.env` changed — enter the password again in Settings. |

## Environment variables (`.env`)

| Name | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs sign-in sessions (changing it signs everyone out) |
| `SETTINGS_SECRET` | Encrypts the SMTP password saved in Settings — keep it unchanged |
| `CRON_SECRET` | Key in the report cron URL |
| `NEXT_PUBLIC_SITE_URL` | The public address (set at build time by `build:cpanel`) |

Variables added in cPanel’s *Setup Node.js App* screen override the `.env` file.
