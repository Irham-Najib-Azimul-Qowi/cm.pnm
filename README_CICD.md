# CI/CD Infrastructure for Cakra Manggala

This project uses a high-reliability CI/CD pipeline to ensure that **broken code never reaches production**.

## 🛡️ Pipeline Objectives
1. **Isolated Package Build**: In Go serverless functions, multiple files using the same package name can cause redeclaration errors. Our CI checks every subdirectory in `api/` independently.
2. **Frontend Integrity**: Ensures Vite can successfully bundle the React application.
3. **Production Gate**: Merges or pushes to `main` are only deployed if both audits pass.

## 🛠️ Local Development & Pre-flight Checks
Before pushing your code, run these commands to detect errors early:

### 1. Go Backend Check
```bash
# Check for redeclaration or syntax errors in all API folders
for dir in $(find api -maxdepth 5 -name "index.go" -exec dirname {} \;); do
  echo "Checking $dir..."
  go build ./$dir
done
```

### 2. React Frontend Check
```bash
npm install
npm run build
```

## ⚙️ CI/CD Setup Instructions

### 1. GitHub Branch Protection (REQUIRED)
To prevent unstable deploys, follow these steps in your GitHub repository:
1. Go to **Settings** > **Branches**.
2. Click **Add branch protection rule**.
3. Branch name pattern: `main`.
4. Enable: **"Require status checks to pass before merging"**.
5. Search and add: `Go Backend Audit` and `React Frontend Audit`.
6. Enable: **"Require branches to be up to date before merging"**.

### 2. Vercel Connection
* This project is optimized for Vercel's **Zero-Config** Go runtime.
* Ensure `POSTGRES_URL` and `JWT_SECRET` are added to Vercel Environment Variables.
* Vercel will automatically detect the `main` push (after CI passes if using branch protection) and deploy.

## ✅ Automation Added
* **GitHub Actions Workflow**: `.github/workflows/ci.yml`
* **Isolated build script**: Now integrated into CI logs for clear error visibility.
