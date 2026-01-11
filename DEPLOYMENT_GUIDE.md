# Auth0 ACUL Login Screen - Complete Deployment Guide

A comprehensive guide for initializing, modifying, debugging, and deploying Auth0 Advanced Customizations for Universal Login (ACUL) screens.

## Table of Contents
1. [Initialization](#initialization)
2. [Modification & Development](#modification--development)
3. [Debugging](#debugging)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## Initialization

### 1. Setup Project

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

**Why:** Ensures all dependencies are installed and the project builds successfully before making changes.

### 2. Configure Auth0 CLI

```bash
# Login to Auth0
auth0 login

# Verify authentication
auth0 tenants list
```

**Why:** Authenticates with your Auth0 tenant to enable configuration management via CLI.

### 3. Create Screen Schema

Create mock data files for local development:

```bash
# Create directory structure
mkdir -p public/screens/login/login

# Create default.json and with-errors.json
# (See public/screens/login-id/login-id/ for reference)
```

**Why:** Mock data enables local development without requiring a live Auth0 tenant connection.

### 4. Get Current Auth0 Configuration

```bash
# Download current login screen config
auth0 acul config get login

# This saves to: acul_config/login.json
```

**Why:** Retrieves the current Auth0 configuration to understand existing setup and avoid overwriting important settings.

---

## Modification & Development

### 1. Make Code Changes

Edit files in `src/screens/login/`:
- `index.tsx` - Main screen component
- `components/` - Screen-specific components
- `hooks/useLoginManager.ts` - Login logic

### 2. Build After Changes

```bash
# Build project with latest changes
npm run build
```

**Why:** Generates optimized production assets in `dist/` with content-hashed filenames for cache busting.

### 3. Test Locally (Optional)

```bash
# Start local dev server with context inspector
npm run dev

# Or serve built files
npx serve dist -p 8080 --cors
```

**Why:** Allows testing changes locally before deploying to Auth0.

### 4. Update Configuration

After building, update `acul_config/login.json` with new asset filenames:

```bash
# Check new asset filenames
ls -la dist/assets/shared/*.css
ls -la dist/assets/login/*.js
ls -la dist/assets/main.*.js

# Update acul_config/login.json with new hashes
# Example: style.Cixsc2g7.css → style.DAIIjM32.css
```

**Why:** Asset filenames include content hashes that change when code is modified. The config must reference the correct filenames.

---

## Debugging

### 1. Check Asset Accessibility

```bash
# Test if assets are accessible via CDN
curl -I "https://cdn.jsdelivr.net/gh/amandhunna/auth0-acul@gh-pages/assets/shared/style.DAIIjM32.css"
```

**Why:** Verifies that assets are publicly accessible and returns HTTP 200. If 404, assets aren't deployed correctly.

### 2. Verify Auth0 Configuration

```bash
# Get current Auth0 config
auth0 acul config get login

# List all configured screens
auth0 acul config list
```

**Why:** Confirms that your local config matches what's deployed in Auth0.

### 3. Test Login Flow

```bash
# Test with organization (required for B2B clients)
auth0 test login CLIENT_ID -o ORG_ID

# Example:
auth0 test login 4gVAwy4Kw2kKrnLUhL9Z7VBGg4edBQaU -o org_FBFTwOEuv0ZStuGG
```

**Why:** Creates a valid Auth0 transaction and opens browser to test your custom login screen. Without organization parameter, you'll get "invalid_request" errors.

### 4. Check Browser Console

When testing, open browser DevTools (F12):
- **Console tab:** Check for JavaScript errors
- **Network tab:** Verify all assets load (status 200)
- **Elements tab:** Confirm custom scripts are injected in `<head>`

**Why:** Identifies runtime errors, failed asset loads, or missing script injections.

### 5. Common Issues

**Error: "invalid_request - parameter organization is required"**
- **Cause:** Client requires organization parameter (B2B setup)
- **Fix:** Include `-o ORG_ID` in test command or add `?organization=ORG_ID` to authorize URL

**Error: "Oops!, something went wrong"**
- **Cause:** Custom scripts not loading (error page doesn't inject head_tags)
- **Fix:** Test with valid transaction using `auth0 test login` command

**Assets return 404**
- **Cause:** Assets not pushed to gh-pages branch or wrong filenames in config
- **Fix:** Verify gh-pages branch has latest dist files and config has correct hashes

---

## Deployment

### Option 1: GitHub + jsDelivr CDN (Recommended for Development)

#### Step 1: Prepare Repository

```bash
# Ensure dist is tracked (remove from .gitignore if needed)
# Edit .gitignore and remove 'dist' line

# Build latest changes
npm run build
```

**Why:** Dist folder needs to be in git for gh-pages branch to serve assets.

#### Step 2: Push to Main Branch

```bash
# Add all changes
git add -A

# Commit with descriptive message
git commit -m "Update login screen: [describe changes]"

# Push to main
git push origin main
```

**Why:** Main branch stores source code and configuration. Keep it updated for version control.

#### Step 3: Deploy to gh-pages Branch

```bash
# Switch to gh-pages branch
git checkout gh-pages

# Copy dist from main branch
git checkout main -- dist/

# Copy dist contents to root
cp -r dist/* .

# Remove dist folder (gh-pages should only have built assets)
rm -rf dist

# Commit and push
git add -A
git commit -m "Deploy latest assets"
git push origin gh-pages

# Return to main branch
git checkout main
```

**Why:** gh-pages branch serves assets via jsDelivr CDN. Assets must be in root directory for CDN to access them.

#### Step 4: Update Auth0 Configuration

```bash
# Update acul_config/login.json with new asset URLs
# Format: https://cdn.jsdelivr.net/gh/USERNAME/REPO@gh-pages/assets/...

# Push config to Auth0
auth0 acul config set login --file acul_config/login.json
```

**Why:** Auth0 needs to know where to load your assets. jsDelivr CDN provides free, fast asset hosting from GitHub.

### Option 2: AWS S3 + CloudFront (Production)

#### Prerequisites
- AWS account with S3 bucket
- CloudFront distribution (optional but recommended)
- GitHub Actions secrets configured

#### Automated Deployment

```bash
# Push to main branch triggers GitHub Actions
git push origin main
```

**Why:** GitHub Actions workflow automatically:
1. Builds the project
2. Uploads to S3
3. Updates Auth0 configuration

#### Manual Deployment

See `DEPLOYMENT.md` for detailed AWS setup instructions.

---

## Quick Reference Commands

### Development Workflow

```bash
# 1. Make code changes
# Edit src/screens/login/...

# 2. Build
npm run build

# 3. Check new asset hashes
ls -la dist/assets/shared/*.css

# 4. Update config with new hashes
# Edit acul_config/login.json

# 5. Test locally (optional)
npm run dev

# 6. Deploy
git add -A
git commit -m "Update login screen"
git push origin main

# 7. Update gh-pages
git checkout gh-pages
git checkout main -- dist/
cp -r dist/* .
rm -rf dist
git add -A
git commit -m "Deploy assets"
git push origin gh-pages
git checkout main

# 8. Update Auth0
auth0 acul config set login --file acul_config/login.json

# 9. Test
auth0 test login CLIENT_ID -o ORG_ID
```

### Verification Commands

```bash
# Check asset accessibility
curl -I "https://cdn.jsdelivr.net/gh/USERNAME/REPO@gh-pages/assets/shared/style.HASH.css"

# Verify Auth0 config
auth0 acul config get login

# List all screens
auth0 acul config list

# Test login flow
auth0 test login CLIENT_ID -o ORG_ID
```

---

## Important Notes

1. **Asset Hashes Change:** Every build generates new content-hashed filenames. Always update `acul_config/login.json` after building.

2. **Organization Required:** If your client requires organization parameter, always include `-o ORG_ID` in test commands.

3. **Error Pages Don't Load Custom Scripts:** Auth0 only injects custom head_tags on valid login pages, not error pages. Use `auth0 test login` for proper testing.

4. **gh-pages Structure:** Assets must be in root of gh-pages branch, not in `dist/` subdirectory.

5. **CORS:** All assets must have `crossorigin="anonymous"` attribute for proper CORS handling.

---

## File Structure

```
project/
├── src/screens/login/          # Source code
├── dist/                       # Built assets (tracked in git)
├── acul_config/
│   └── login.json             # Auth0 configuration
├── public/screens/login/       # Mock data for local dev
└── .github/workflows/          # CI/CD automation
```

---

## Support

- **Auth0 CLI Docs:** https://github.com/auth0/auth0-cli
- **ACUL Documentation:** https://auth0.com/docs/customize/login-pages/advanced-customizations
- **jsDelivr CDN:** https://www.jsdelivr.com/

