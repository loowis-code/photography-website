# Deployment Guide: Cloudflare Workers

## Prerequisites

- A Cloudflare account (https://dash.cloudflare.com/sign-up)
- Node.js >= 22.17.0
- Your existing Neon database connection string
- Your existing GitHub OAuth app credentials

---

## Step 1: Create the R2 Bucket

1. In the Cloudflare dashboard, go to **R2 Object Storage** in the left sidebar
2. Click **Create bucket**
3. Name it `photography-images`
4. Choose a location hint near your users (e.g. EU West)
5. Click **Create bucket**

## Step 2: Enable Public Access for R2

**Option A — R2 public URL (quickest):**

1. Go to the bucket → **Settings** → **Public access**
2. Enable **R2.dev subdomain** — this gives you a URL like `https://pub-xxxx.r2.dev`
3. Use this as your `R2_PUBLIC_URL`

**Option B — Custom domain (recommended for production):**

1. Your domain must already be on Cloudflare DNS
2. Go to the bucket → **Settings** → **Custom domains**
3. Add e.g. `images.loowis.co.uk`
4. Cloudflare handles the SSL cert automatically
5. Use `https://images.loowis.co.uk` as your `R2_PUBLIC_URL`

## Step 3: Create R2 API Credentials

1. Go to **R2 Object Storage** → **Manage R2 API tokens**
2. Click **Create API token**
3. Give it **Object Read & Write** permission on the `photography-images` bucket
4. Save the **Access Key ID** and **Secret Access Key**

Your `R2_ENDPOINT` will be: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

Find your Account ID in the right sidebar of the Cloudflare dashboard.

## Step 4: Generate an Auth Secret

```bash
openssl rand -base64 32
```

Save this value — it's your `AUTH_SECRET`.

## Step 5: Authenticate Wrangler

```bash
npx wrangler login
```

This opens a browser for you to authorize Wrangler with your Cloudflare account.

## Step 6: Set Secret Environment Variables

Run each of these commands and paste the value when prompted:

```bash
npx wrangler secret put DATABASE_URL
# paste your Neon connection string

npx wrangler secret put AUTH_SECRET
# paste the value from Step 4

npx wrangler secret put AUTH_GITHUB_ID
# paste your GitHub OAuth Client ID (same as current GITHUB_ID)

npx wrangler secret put AUTH_GITHUB_SECRET
# paste your GitHub OAuth Client Secret (same as current GITHUB_SECRET)

npx wrangler secret put ADMIN_EMAIL
# paste: incheslewis@gmail.com

npx wrangler secret put AUTH_URL
# paste: https://pictures.loowis.co.uk/api/auth

npx wrangler secret put R2_ENDPOINT
# paste: https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com

npx wrangler secret put R2_ACCESS_KEY_ID
# paste the Access Key ID from Step 3

npx wrangler secret put R2_SECRET_ACCESS_KEY
# paste the Secret Access Key from Step 3

npx wrangler secret put R2_PUBLIC_URL
# paste: https://images.loowis.co.uk (or your r2.dev URL from Step 2)

npx wrangler secret put R2_BUCKET_NAME
# paste: photography-images
```

## Step 7: Migrate Images from Vercel Blob to R2

Create a local `.env` file temporarily (this is gitignored):

```
DATABASE_URL=your_neon_connection_string
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_key
R2_SECRET_ACCESS_KEY=your_r2_secret
R2_BUCKET_NAME=photography-images
R2_PUBLIC_URL=https://images.loowis.co.uk
```

Then run:

```bash
npx tsx scripts/migrate-blobs-to-r2.ts
```

This downloads every image from Vercel Blob, uploads it to R2, and updates the database URLs. It's idempotent — safe to re-run if it fails partway through.

## Step 8: Deploy

```bash
npm run deploy
```

This runs `vite build` then `wrangler deploy`. On first run, Wrangler creates the Worker. It will print a URL like:

```
https://photography-website.<your-subdomain>.workers.dev
```

Test this URL to verify the site works.

## Step 9: Set Up Custom Domain

1. Go to **Cloudflare dashboard** → **Workers & Pages** → your worker (`photography-website`)
2. Go to **Settings** → **Domains & Routes**
3. Click **Add** → **Custom domain**
4. Enter `pictures.loowis.co.uk`
5. Cloudflare automatically creates the DNS record and SSL cert

If your domain isn't already on Cloudflare DNS, you'll need to transfer your nameservers first.

## Step 10: Update GitHub OAuth Callback URL

1. Go to https://github.com/settings/developers
2. Find your OAuth app
3. Update the **Authorization callback URL** to:
   ```
   https://pictures.loowis.co.uk/api/auth/callback/github
   ```
4. Update the **Homepage URL** to `https://pictures.loowis.co.uk`
5. Save

## Step 11: Update AUTH_URL (if needed)

If you initially set `AUTH_URL` to the workers.dev URL, update it now:

```bash
npx wrangler secret put AUTH_URL
# paste: https://pictures.loowis.co.uk/api/auth
```

Then redeploy:

```bash
npm run deploy
```

## Step 12: Verify Everything Works

- [ ] Home page loads with featured images (film/digital toggle)
- [ ] All Images page paginates and sorts
- [ ] Collections page shows all collections
- [ ] Clicking a collection shows its images
- [ ] Image detail page shows metadata and map (for geotagged photos)
- [ ] Image map page shows all markers
- [ ] Search returns results
- [ ] Non-existent URL shows 404 page with random image
- [ ] `/admin` redirects to GitHub sign-in
- [ ] After sign-in, admin dashboard shows all images
- [ ] Upload a new image — appears in dashboard
- [ ] Edit an image — changes persist
- [ ] Delete an image — removed from R2 and database
- [ ] Create/edit/delete a collection
- [ ] Sign out works

## Step 13: Tear Down Vercel

Once everything is confirmed working on Cloudflare:

1. Remove the project from the Vercel dashboard
2. Delete the Vercel Blob storage
3. Revoke the old `BLOB_READ_WRITE_TOKEN`
4. Delete the local `.env` file you created in Step 7

---

## Ongoing Deployments

After initial setup, deploying changes is:

```bash
npm run deploy
```

Or set up Git-triggered deploys by connecting your repo in the Cloudflare dashboard under **Workers & Pages** → your worker → **Settings** → **Build** → connect to GitHub.

## Local Development

```bash
npm run dev
```

The Vite dev server runs at http://localhost:3000 with hot reload. For local dev against the real database, create a `.env.local` file with your env vars.

## Environment Variables Reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js signing secret (generate with `openssl rand -base64 32`) |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |
| `ADMIN_EMAIL` | Email allowed to sign in to admin |
| `AUTH_URL` | Production auth base URL (e.g. `https://pictures.loowis.co.uk/api/auth`) |
| `R2_ENDPOINT` | R2 S3-compatible endpoint (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`) |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret key |
| `R2_PUBLIC_URL` | Public URL for serving images from R2 |
| `R2_BUCKET_NAME` | R2 bucket name (`photography-images`) |
