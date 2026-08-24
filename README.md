# Saheer MK - Dynamic Developer Portfolio & CMS

A cinematic, highly-optimized developer portfolio built with **React 19**, **Vite**, **Framer Motion**, and **React Three Fiber**, dynamically powered by **Cloudflare Pages Functions** and a **Cloudflare D1 SQL database**.

Features a secure, password-protected Admin Dashboard (CMS) for managing projects, skills, and configuration values in real-time, backed by a resilient static fallback system.

---

## 🛠 Architecture & Features

*   **Vite + React 19 Frontend**: High-performance, SEO/AEO-optimized Single Page Application.
*   **Cloudflare Pages Functions**: Serverless API endpoints (`/api/*`) for fetching and editing portfolio data.
*   **Cloudflare D1 SQL Database**: Serverless SQLite database storing your live project list, skills, and global site configurations.
*   **Secure Admin Dashboard (`/admin`)**: Password-protected dashboard to manage site configurations, skills, and project lists. Includes an integrated image-to-base64 converter for showcasing project assets.
*   **Resilient Fallback System**: If the D1 database is unreachable, the site automatically and silently falls back to static hardcoded configurations, ensuring 100% uptime.

---

## 💻 Local Development & Testing

Follow these steps to run the portfolio and CMS locally on your machine.

### Prerequisites
Make sure you have Node.js (v18+) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize and Seed the Local D1 Database
Create and populate your local SQLite database using our schema migration script:
```bash
npm run db:init
```
*This command runs `wrangler d1 execute` to set up tables (`projects`, `skills`, `site_config`) in `.wrangler` and seeds them with initial data.*

### 3. Build the Application
Before running wrangler dev, compile the TypeScript code and compile static assets:
```bash
npm run build
```

### 4. Run the Dev Server
Launch the local Cloudflare Pages dev server (which serves the frontend assets and executes Pages Functions locally):
```bash
npm run dev:cf
```
The server will start at: **`http://localhost:8788`**

### 5. Access the Admin Dashboard
1.  Go to `http://localhost:8788/admin`
2.  Log in using the default password: **`admin`**
3.  Add, edit, or remove projects, skills, and global configurations.
4.  Navigate back to `http://localhost:8788` to see changes update in real-time.

---

## 🚀 Production Hosting & Deployment

The portfolio is designed to be hosted on **Cloudflare Pages** linked with **Cloudflare D1**. Follow these steps to host your live site.

### Step 1: Create a Production D1 Database
Create your database using the Cloudflare Wrangler CLI:
```bash
npx wrangler d1 create portfolio-db
```
Wrangler will output the database details. For example:
```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "your-database-id-guid"
```

### Step 2: Update wrangler.toml
Open `wrangler.toml` in your project root and replace the `database_id` value with your newly created production database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "your-database-id-guid" # Paste your production ID here
```

### Step 3: Seed the Production D1 Database
Execute the SQL migrations on your remote production database:
```bash
npm run db:init:prod
```

### Step 4: Create a Cloudflare Pages Project
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3.  Select your repository.
4.  Configure the Build Settings:
    *   **Framework preset**: `Vite` (or None)
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
5.  Click **Save and Deploy**.

### Step 5: Bind the D1 Database in Cloudflare Dashboard
To allow your deployed Pages Functions to talk to your live database:
1.  In the Cloudflare dashboard, go to your Pages project -> **Settings** -> **Functions**.
2.  Scroll down to **D1 database bindings**.
3.  Click **Add binding**:
    *   **Variable name**: `DB` (Must match exactly)
    *   **D1 database**: Select your `portfolio-db`
4.  Click **Save**.

### Step 6: Configure your Secure Admin Password
Define your custom dashboard login password:
1.  Go to your Pages project -> **Settings** -> **Environment variables**.
2.  Click **Add variable** (under Production and Preview environments):
    *   **Variable name**: `ADMIN_PASSWORD`
    *   **Value**: `your-secure-password-here`
3.  Click **Save**.
*(Note: To set or change the admin password locally for development, create a `.dev.vars` file in your project root and write `ADMIN_PASSWORD=your-local-password` inside).*

### Step 7: Redeploy the Project
Since bindings and environment variables were updated, trigger a new deployment:
1.  Go to the **Deployments** tab.
2.  Click **Create new deployment** (or push a commit to your git main branch).
3.  Once the build finishes, your dynamic portfolio is live!

---

## 🛠 Important Configuration Details
*   **D1 Database Binding Name**: The D1 database binding name in both `wrangler.toml` and your Cloudflare Pages dashboard **must** be exactly `DB` (all uppercase). The serverless API functions query `context.env.DB` specifically; using any other name will cause API requests to fail.
*   **Git Exclusions**: Local databases stored in `.wrangler/` and local credential files (`.dev.vars`) are excluded from Git tracking via `.gitignore` to safeguard passwords and development data.
*   **Dynamic CV Serving**: The resume button queries `/api/cv`. If a custom PDF has been uploaded via the Admin Panel, it is served directly. If not, the API redirects seamlessly to the static asset `/saheermk-cv.pdf`.

