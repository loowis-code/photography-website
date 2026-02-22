# Photography Website

A personal photography portfolio at [pictures.loowis.co.uk](https://pictures.loowis.co.uk). Built with TanStack Start and deployed on Cloudflare Workers.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React SSR with file-based routing)
- **Hosting**: Cloudflare Workers
- **Database**: Neon PostgreSQL
- **Image Storage**: Cloudflare R2
- **Auth**: Auth.js (GitHub OAuth, single admin user)
- **UI Components**: [loowis-component-library](https://www.npmjs.com/package/loowis-component-library)

## Features

- Film and digital photography galleries with sorting and filtering
- Image detail pages with metadata and Leaflet map for geotagged photos
- Full-page image map showing all geotagged photos
- Collections for grouping images
- Search across titles, descriptions, and locations
- Admin dashboard for uploading, editing, and deleting images and collections

## Local Development

```bash
npm install
npm run dev
```

Runs at http://localhost:3000. Requires a `.env.local` file — see `.env` for the required variables.

## Deployment

```bash
npm run deploy
```

## Project Structure

```
src/
  routes/          # File-based routes (pages + API)
  components/      # Shared React components
  lib/             # Database, auth, R2, and types
  lib/server/      # Server functions (data fetching + admin CRUD)
  styles/          # CSS modules
  helpers/         # Sorting and filtering utilities
scripts/           # One-time migration scripts
```
