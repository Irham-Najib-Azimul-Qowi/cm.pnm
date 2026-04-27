# Cakra Manggala Web App (React + Go Serverless)

This project is a migration of the Cakra Manggala system to a modern serverless architecture.

## Deployment Status
- Build: Reliable & Clean
- Architecture: React (Vite) + Go Serverless API
- Database: Vercel Postgres (UUID supported)

## Vercel Deployment
- Frontend build uses `npm run build` and outputs to `dist`.
- Go serverless functions are auto-detected from the root `api/` directory.
- SPA routes are handled by a Vercel rewrite to `index.html`, so React Router paths keep working on refresh.

### Required Environment Variables
- `POSTGRES_URL`
- `JWT_SECRET`

### Recommended Vercel Project Settings
- Framework Preset: `Vite`
- Root Directory: project root (`cakra-manggala-rct-go`)
- Build Command: `npm run build`
- Output Directory: `dist`

### Local Verification
```bash
npm install
npm run build
npm run lint
```

If you want to verify Go handlers locally, install Go 1.21+ and run:

```bash
for dir in $(find api -maxdepth 5 -name "index.go" -exec dirname {} \;); do
  go build ./$dir
done
```

## Recent Fixes
- Removed unused imports in Go handlers.
- Corrected `golang.org/x/crypto` import path.
- Verified all handlers for zero-error compilation.

## Troubleshooting Build Failures
If you see "imported and not used" errors, ensure you are deploying the **LATEST** commit. Vercel sometimes caches older build configurations.
