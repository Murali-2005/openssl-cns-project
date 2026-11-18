# How to Deploy to Render (100% Free Hosting)

This project is configured and ready for 1-click deployment on [Render](https://render.com).

---

## Step 1: Push Project to GitHub

1. Open your browser and go to: **[https://github.com/new](https://github.com/new)**
2. Create a new repository:
   - **Repository name**: `openssl-cns-project`
   - Choose **Public** (or Private)
   - Do **NOT** initialize with README or .gitignore (we already have them committed)
   - Click **Create repository**

3. In your project directory (`c:\Users\lsmur\OneDrive\Desktop\crypt`), run:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/openssl-cns-project.git
   git push -u origin main
   ```
   *(Replace `<YOUR_GITHUB_USERNAME>` with your GitHub username).*

---

## Step 2: Deploy on Render.com

### Option A: Standard Static Site (Recommended — 100% Free & Fast CDN)
1. Go to **[https://dashboard.render.com](https://dashboard.render.com)** (sign in with GitHub).
2. Click **New +** at the top right and select **Static Site**.
3. Under **Connect a repository**, find and select `openssl-cns-project`.
4. Fill in the deployment settings:
   - **Name**: `openssl-cryptography-lab` (or any name you choose)
   - **Branch**: `main`
   - **Build Command**: *(Leave empty)*
   - **Publish Directory**: `web_app`
5. Click **Create Static Site**.

---

### Option B: Using Render Blueprint (`render.yaml`)
1. Go to **[https://dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** -> **Blueprint**.
3. Select your `openssl-cns-project` repository.
4. Render will automatically detect `render.yaml` and configure the static site, CDN, and SPA routing in 1 click.
5. Click **Apply**.

---

## Step 3: Your Live URL
In ~30 seconds, Render will complete the deployment and provide your live HTTPS URL:
`https://openssl-cryptography-lab.onrender.com`

---

## Why Render Static Site is Best for this Project:
- **Zero Cold Starts**: Static sites on Render do NOT spin down or sleep after inactivity.
- **Global CDN**: Serves HTML, CSS, JavaScript, and sample PDF files instantly worldwide.
- **Client-Side Web Crypto API**: Hybrid encryption (AES-256-GCM + RSA-2048 + SHA-256) runs entirely in the user's browser securely with full HTTPS TLS.
