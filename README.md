# Habit Manager Frontend

React frontend for the Habit Manager application.

## Backend API Configuration

The app reads the backend base URL from:

- `process.env.REACT_APP_API_BASE_URL`

If not set, it defaults to:

- `https://habit-backend-api-gzafhjcjcsf0fdfn.southeastasia-01.azurewebsites.net/api/users`

All frontend API calls use this base URL from `src/config/apiConfig.js`.

## Local Development

Install dependencies:

```bash
npm install
```

Run local dev server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Run production build locally:

```bash
npm start
```

Serve existing production build without rebuilding:

```bash
npm run start:serve
```

## Azure App Service Deployment (Node.js)

This project is configured for Azure App Service startup and build:

- `postinstall` runs `npm run build` during deployment.
- `start` runs `serve -s build` to serve the React production build.

### 1) Create / Configure App Service

- Runtime stack: Node.js LTS (18+ recommended)
- OS: Linux recommended

### 2) Configure Application Settings

In Azure Portal -> App Service -> Environment variables, add:

- `REACT_APP_API_BASE_URL = https://habit-backend-api-gzafhjcjcsf0fdfn.southeastasia-01.azurewebsites.net/api/users`
- `SCM_DO_BUILD_DURING_DEPLOYMENT = true`

Optional startup command in portal:

- `npm start`

### 3) Deploy

Use any supported deployment method (GitHub Actions, Local Git, ZIP deploy, or VS Code Azure extension).

During deployment Azure will:

1. Run `npm install`
2. Trigger `postinstall` -> `npm run build`
3. Start app with `npm start`

### 4) Verify

1. Open your frontend App Service URL.
2. Confirm data loads from the backend.
3. Check App Service logs if needed:
   - Log stream in Azure Portal
   - Or `az webapp log tail`

## Scripts

- `npm run dev` -> Local React development server
- `npm run build` -> Production build
- `npm start` -> Builds latest code, then serves `build/`
- `npm run start:serve` -> Serves existing `build/` only
