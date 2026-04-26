# Cakra Manggala Web App (React + Go Serverless)

This project is a migration of the Cakra Manggala system to a modern serverless architecture.

## Deployment Status
- Build: Reliable & Clean
- Architecture: React (Vite) + Go Serverless API
- Database: Vercel Postgres (UUID supported)

## Recent Fixes
- Removed unused imports in Go handlers.
- Corrected `golang.org/x/crypto` import path.
- Verified all handlers for zero-error compilation.

## Troubleshooting Build Failures
If you see "imported and not used" errors, ensure you are deploying the **LATEST** commit. Vercel sometimes caches older build configurations.
