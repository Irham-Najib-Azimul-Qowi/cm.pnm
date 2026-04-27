# CI/CD Infrastructure for Cakra Manggala

This project uses GitHub Actions plus Vercel Git deployments so broken code is caught before it reaches production.

## Deployment Model

- Production branch: `main`
- Preview branches: every branch other than `main`
- Vercel project root directory: `/`
- Frontend runtime: Vite React
- Backend runtime: Go serverless functions in `api/`

This repository is not configured as a separate frontend/backend monorepo. Vercel should import the repository root directly.

## Pipeline Objectives

1. Catch Go serverless packaging errors by compiling each `api/**/index.go` directory in isolation.
2. Catch frontend regressions with `npm run lint` and `npm run build`.
3. Keep production tied to `main` while letting feature branches use Vercel Preview Deployments.

## Local Pre-flight Checks

Run these before opening a PR:

```bash
npm ci
npm run lint
npm run build
```

If Go is installed locally, also run:

```bash
for dir in $(find api -maxdepth 5 -name "index.go" -exec dirname {} \;); do
  echo "Checking $dir..."
  go build ./$dir
done
```

## GitHub Setup

### 1. Branch Protection for `main`

In GitHub:

1. Open `Settings` > `Branches`.
2. Add or edit the protection rule for `main`.
3. Enable `Require a pull request before merging`.
4. Enable `Require status checks to pass before merging`.
5. Add these required checks:
   - `Go Backend Audit`
   - `React Frontend Audit`
6. Enable `Require branches to be up to date before merging`.
7. Enable `Restrict who can push to matching branches` if you want to block direct pushes to `main`.

### 2. Pull Request Flow

- Push feature work to a non-`main` branch.
- Let Vercel generate a Preview Deployment for that branch.
- Open a PR into `main`.
- Merge only after GitHub Actions are green and the preview has been reviewed.

## Vercel Setup

### 1. Import Project

In Vercel:

1. Click `Add New...` > `Project`.
2. Import the repository `cm.pnm`.
3. Set `Root Directory` to `/`.
4. Use framework preset `Vite`.
5. Confirm build command `npm run build`.
6. Confirm output directory `dist`.

### 2. Environment Variables

Add these variables in `Project Settings` > `Environment Variables`:

- `POSTGRES_URL`
- `JWT_SECRET`

### 3. Git Behavior

- Production deployments should track `main`.
- Non-`main` branches should remain preview-only.
- If your Vercel plan supports Deployment Checks, enable them so production promotion waits for GitHub checks.

## What the Workflow Does

The workflow in `.github/workflows/ci.yml` now:

- runs on every branch push and on PRs targeting `main`
- compiles Go handlers in isolation
- runs frontend lint
- runs frontend production build
- provides a dedicated `Production Guard` signal on pushes to `main`
