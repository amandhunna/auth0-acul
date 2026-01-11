# Auth0 ACUL React Sample (React SDK)

This sample demonstrates how to build custom Auth0 Advanced Customizations for Universal Login (ACUL) screens using React, TypeScript, Tailwind CSS, and the **Auth0 ACUL React SDK**.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server with context inspector
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Serve built files locally for testing
npx serve dist -p 8080 --cors
```

## Development with Context Inspector

The development server includes **ul-context-inspector** - a tool for local development without an Auth0 tenant.

**What it does:**

- Simulates Auth0's Universal Login context using local mock JSON files
- Enables instant screen switching, variant testing, and context editing
- Automatically removed from production builds

**Development vs Production:**

- **Development**: Uses local mocks from `public/screens/` (no Auth0 required)
- **Production**: Uses real Auth0 context from `window.universal_login_context`

### Adding Mock Data

Create mock files in `public/screens/{prompt}/{screen}/`:

```bash
mkdir -p public/screens/login/login
```

Add `default.json` and `with-errors.json`:

```json
{
  "screen": {
    "name": "login",
    "texts": { "pageTitle": "Log in | Auth0" }
  },
  "tenant": { "name": "your-tenant" }
}
```

Register in `public/manifest.json`:

```json
{
  "versions": ["v2", "v0"],
  "screens": [
    {
      "login": {
        "login": {
          "path": "/screens/login/login",
          "variants": ["default", "with-errors"]
        }
      }
    }
  ]
}
```

Restart `npm run dev` - the screen appears in the inspector automatically!

## Build Output

The Vite build process generates optimized bundles with code splitting:

```
dist/
├── index.html                           # Main entry point
└── assets/
    ├── main.[hash].js                   # Main application bundle
    ├── shared/
    │   ├── style.[hash].css             # Global styles (Tailwind + Auth0 theme)
    │   ├── react-vendor.[hash].js       # React core (~194 kB)
    │   ├── vendor.[hash].js             # Third-party dependencies (~347 kB)
    │   └── common.[hash].js             # Shared app code (~95 kB)
    └── [screen-name]/
        └── index.[hash].js              # Screen-specific code (0.9-6 kB)
```

**Bundle Strategy:**

- **react-vendor**: React + ReactDOM for optimal caching
- **vendor**: Third-party packages (captcha providers, form libraries, utilities)
- **common**: Shared components, hooks, and utilities from src/
- **Screen bundles**: Minimal screen-specific logic for fast loading

Each screen can be deployed independently for incremental rollouts.

## Features

- **Auth0 ACUL React SDK Integration**: Uses `@auth0/auth0-acul-react`
- **Modern Stack**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Auth0 Design System**: Implements Auth0's design language with theme support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **CI/CD Ready**: GitHub Actions workflow for automated deployment
- **Development Tools**: Integrated context inspector for real-time Auth0 context visualization and manipulation

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with optimized code splitting (react-vendor, vendor, common, screen bundles)
- **Styling**: Tailwind CSS v4 with Auth0 theme engine
- **Auth SDK**: @auth0/auth0-acul-react
- **Testing**: Jest + React Testing Library
- **UI Components**: Custom ULTheme components following Auth0 design system

## Project Structure

```
react/
├── src/
│   ├── screens/           # 31 authentication screens
│   ├── components/        # Reusable themed UI components
│   ├── hooks/            # React hooks for auth flows
│   ├── utils/            # Helper utilities and theme engine
│   ├── test/             # Test utilities and setup
│   └── types/            # TypeScript definitions
├── .github/workflows/    # Deployment automation
└── ...config files
```

## Deployment

This sample includes a GitHub Actions workflow for automated deployment to AWS S3. See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions or [.github/GITHUB_ACTIONS.md](.github/GITHUB_ACTIONS.md) for workflow details.

## Documentation

For detailed documentation, refer to the main repository README and Auth0 ACUL documentation.

- 1. auth0 acul config get login [get acul config]
- 2. auth0 acul dev
- 3. auth0 acul config generate <screen>
- 4. auth0 acul dev --connected <later select login>

i want to push current changes for login screen to auth0 acul what command i have to use from my local machine. first i need to sync my local with auth0 may be using --connected to review live fixes

- auth0 acul dev --connected
  This command will:
  Build your project automatically
  Configure your Auth0 tenant with the login screen
  Start a local development server
  Watch for file changes and automatically push updates to Auth0
  Allow you to test live changes in your Auth0 tenant

In a new terminal window:

- auth0 test login
  or
  npm run build
  auth0 acul dev --connected

Note: The --connected flag connects your local development environment to your Auth0 tenant, so changes are automatically synced. This is useful for reviewing live fixes before final deployment.

- auth0 --version

- auth0 tenants list 2>&1 | head -10
  select the required tenant

- auth0 acul --help
  verify

- auth0 acul dev --connected --screens login
  Syncing your login screen with Auth0 ACUL. The command is running and will:
  Build your project (npm run build)
  Update the login screen's advance rendering settings in your Auth0 tenant
  Watch for changes and automatically patch assets when you make updates
  What's happening:
  The command is running in connected mode, which syncs your local login screen code with your Auth0 tenant (aidash-platform-dev.us.auth0.com)
  It will watch the dist directory for changes and automatically update Auth0 when you rebuild
  To verify the sync:
  Check the terminal output for confirmation messages
  Test the login flow: auth0 test login (in a new terminal)
  Or visit your Auth0 login page to see the changes
  Note: The command runs continuously in watch mode. To stop it, press Ctrl+C in the terminal.
  Your login screen code is now syncing with Auth0 ACUL. Changes you make locally will be automatically pushed to your tenant when you rebuild.

NOTE: Assets are patching, but changes aren't visible. Checking the Auth0 configuration and testing the login flow:

- auth0 acul config get login
  No configuration file path specified. Defaulting to 'acul_config/login.json'.
  💡 Tip: Use `auth0 acul config set` to sync local config to remote or `auth0 acul config list` to view all ACUL screens. ▸ Configuration downloaded and saved at 'acul_config/login.json'.

- 5. auth0 acul dev --connected --screens login
- 6. auth0 acul config get login
     auth0 test login --help
     auth0 test login
     auth0 test login 4gVAwy4Kw2kKrnLUhL9Z7VBGg4edBQaU
     auth0 acul config set --help
     auth0 domains list
     echo "To test your login screen, run: auth0 test login 4gVAwy4Kw2kKrnLUhL9Z7VBGg4edBQaU"

Examples:
auth0 test login
auth0 test login <client-id>
auth0 test login <client-id> --connection-name <connection-name>
auth0 test login <client-id> --connection-name <connection-name> --audience <api-identifier|api-audience>
auth0 test login <client-id> --connection-name <connection-name> --audience <api-identifier|api-audience> --organization <org-id>
auth0 test login <client-id> --connection-name <connection-name> --audience <api-identifier|api-audience> --domain <domain> --params "foo=bar"
auth0 test login <client-id> --connection-name <connection-name> --audience <api-identifier|api-audience> --domain <domain> --scopes <scope1,scope2>
auth0 test login <client-id> -c <connection-name> -a <api-identifier|api-audience> -d <domain> -s <scope1,scope2> --force
auth0 test login <client-id> -c <connection-name> -a <api-identifier|api-audience> -d <domain> -s <scope1,scope2> --json
auth0 test login <client-id> -c <connection-name> -a <api-identifier|api-audience> -d <domain> -s <scope1,scope2> --json-compact
auth0 test login <client-id> -c <connection-name> -a <api-identifier|api-audience> -d <domain> -o <org-id> -s <scope1,scope2> -p "foo=bar" -p "bazz=buzz" --json
auth0 test login <client-id> -c <connection-name> -a <api-identifier|api-audience> -d <domain> -o <org-id> -s <scope1,scope2> -p "foo=bar","bazz=buzz" --json
auth0 test login <client-id> -c <connection-name> -a <api-identifier|api-audience> -d <domain> -s <scope1,scope2> --force --json

Flags:
-a, --audience string The unique identifier of the target API
you want to access. For Machine to
Machine Applications, only the enabled
APIs will be shown within the interactive
prompt.
-c, --connection-name string The connection name to test during login.
-d, --domain string One of your custom domains.
--force Skip confirmation.
-h, --help Help for login.
--json Output in json format.
--json-compact Output in compact json format.
-o, --organization string organization-id to use for the login. Can
use organization-name if
allow_organization_name_in_authentication_api is enabled for tenant
-p, --params stringToString Custom parameters to include in the login
URL. (default [])
-s, --scopes strings The list of scopes you want to use.
(default [openid,profile])

Global Flags:
--debug Enable debug mode.
--no-color Disable colors.
--no-input Disable interactivity.
--tenant string Specific tenant to use. (default
"aidash-platform-dev.us.auth0.com")

git checkout --orphan gh-pages 2>/dev/null || git checkout -b gh-pages 2>/dev/null || echo "Branch may already exist"

git rm -rf --cached . 2>/dev/null || true
cp -r dist/_ . 2>/dev/null && touch .nojekyll && ls -la | head -15cp -r dist/_ . 2>/dev/null && touch .nojekyll && ls -la | head -15
git push -u origin gh-pages
auth0 acul config set login --file acul_config/login.json

curl -I "https://cdn.jsdelivr.net/gh/amandhunna/auth0-acul@gh-pages/assets/shared/style.C2YULJCW.css" 2>&1 | head -5
