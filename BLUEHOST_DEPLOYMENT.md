# EpitomeTRC Platform - Bluehost Server Production Deployment Guide

This document describes the steps required to deploy, run, and maintain the Next.js EpitomeTRC platform on a **Bluehost VPS or Dedicated Hosting server**.

---

## 1. Hosting Architecture Overview

Bluehost servers utilize **Phusion Passenger** (an application server) to manage Node.js processes. 
- **Application Directory**: `/home/username/public_html/epitometrc`
- **Application Startup File**: `server.js` (Passenger requires a single entry point file)
- **Node.js Version**: 18.x or 20.x is recommended.

---

## 2. Server Configuration Steps

### Step 2.1: Initialize the Node.js Application
1.  Log in to your **Bluehost cPanel / Portal**.
2.  Search for **Node.js Manager** or **Setup Node.js App**.
3.  Click **Create Application**.
4.  Configure the following parameters:
    *   *Node.js Version*: Select `20.x` or `18.x`.
    *   *Application Mode*: Select `Production`.
    *   *Application Root*: `epitometrc-web` (e.g. `/home/username/epitometrc-web`)
    *   *Application URL*: `https://epitometrc.com` (or your domain choice)
    *   *Application Startup File*: `server.js`
5.  Click **Create**.

---

## 3. Database Configuration

The platform uses **Prisma** to interact with a PostgreSQL database.

### Step 3.1: Create a PostgreSQL DB on Bluehost
1.  In cPanel, go to **PostgreSQL Database Wizard**.
2.  Create a database: e.g. `username_epitomedb`.
3.  Create a user: e.g. `username_admin` with a strong password.
4.  Associate the user to the database and grant **All Privileges**.

### Step 3.2: Configure Environment Variables
Inside the Node.js application configuration screen in Bluehost, add the following environment variables:

| Variable Name | Purpose | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://username_admin:Password@127.0.0.1:5432/username_epitomedb` |
| `JWT_SECRET` | Authentication tokens signing key | *Generate a secure 64-char string* |
| `SENTRY_DSN` | Telemetry error logging endpoint | *Optional - Sentry Project token* |
| `EMAIL_SERVER_HOST` | Transactional SMTP server | `smtp.bluehost.com` or `smtp.resend.com` |
| `EMAIL_SERVER_PORT` | SMTP port | `587` |
| `EMAIL_SERVER_USER` | SMTP Username | `noreply@epitometrc.com` |
| `EMAIL_SERVER_PASSWORD`| SMTP account password | *Your email credentials* |
| `EMAIL_FROM` | Dispatch sender address | `noreply@epitometrc.com` |

---

## 4. Port Proxying & Application Server Entry (`server.js`)

Since Phusion Passenger forwards requests internally, we must provide a standard `server.js` entry point in the application root folder (`/home/username/epitometrc-web/apps/web/server.js`) that boots the Next.js production server.

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

---

## 5. SSL / TLS Setup

1.  In cPanel, search for **SSL/TLS Status**.
2.  Select your target domain (`epitometrc.com`).
3.  Click **Run AutoSSL**. This will issue and install a Let's Encrypt SSL certificate automatically.
4.  Ensure **Force HTTPS Redirect** is enabled in cPanel redirects.

---

## 6. Build and Migration Compilation

To compile and launch the production server:
1.  Open the Terminal in Bluehost cPanel.
2.  Navigate to the application root directory:
    ```bash
    cd /home/username/epitometrc-web
    ```
3.  Install packages:
    ```bash
    npm install
    ```
4.  Run Prisma schema migrations to set up database structures:
    ```bash
    npx prisma db push
    ```
5.  Seed the database with default stats, services, and plans:
    ```bash
    npx prisma db seed
    ```
6.  Build the Next.js production bundle:
    ```bash
    npm run build
    ```
7.  Go back to Node.js App Manager in cPanel and click **Restart Application**.
