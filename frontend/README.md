# Flower Wholesale Management Desktop

React + Vite + Electron desktop frontend for a flower wholesale business. The app includes exactly these business pages: Login, Dashboard, Supplier, Customer, Purchase Entry, Sales Entry, Ledger, Payment Receipt, and Logout.

## Requirements
- Windows 10/11
- Node.js 20 LTS or later
- npm
- Internet is needed once to install npm packages and download Electron. The installed application can run offline on the office LAN.

## Run in browser during development
```bash
npm install
copy .env.example .env
npm run dev
```
Open http://127.0.0.1:5173

## Run desktop app during development
```bash
npm install
npm run electron:dev
```

## Build Windows installer
Run on a Windows build machine:
```bash
npm install
npm run dist:win
```
Installer output is created in `release/`. Give the generated `Flower Wholesale Management Setup 1.0.0.exe` to each client PC.

## Demo mode
The default `.env.example` uses `VITE_DEMO_MODE=true`. Demo data is stored in browser localStorage on each computer. Demo login:
- Username: `admin`
- Password: `admin123`

**Important:** Demo mode is for UI testing only. Local browser storage is not a shared database. Do not use it for the real 10+ user office deployment.

## Connect to the Spring Boot API Gateway
1. Copy `.env.example` to `.env`.
2. Set the central LAN gateway address, for example:
   `VITE_API_BASE_URL=http://192.168.1.20:8080/api`
3. Set `VITE_DEMO_MODE=false`.
4. Rebuild the installer with `npm run dist:win`.

The API URL is compiled into the frontend at build time. If the office server IP changes, rebuild the app or implement a runtime configuration file.

## API contract expected by this frontend
The backend is not included in this frontend package. Suggested API endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Login; returns `{ token }` or `{ accessToken }` |
| GET | `/api/dashboard/summary` | Dashboard KPIs |
| GET/POST | `/api/suppliers` | Supplier list / create |
| GET/POST | `/api/customers` | Customer list / create |
| GET/POST | `/api/purchases` | Flower delivery and advance settlement |
| GET/POST | `/api/sales` | Wholesale sales |
| GET | `/api/ledger?partyType=SUPPLIER` | Supplier/customer ledger |
| POST | `/api/payments` | Payment to supplier |
| POST | `/api/receipts` | Receipt from customer |

The `src/services/api.js` file contains the Axios client, JWT interceptor, endpoint constants, and demo-mode switch. Before production, wire each page to the agreed backend response DTOs and remove all demo fallback state.

## Critical production notes
- Install the EXE on each employee computer, but run the Spring Boot services and PostgreSQL centrally on the office server. Do not run a separate database per employee.
- The UI sample currently uses localStorage for demo records and does not synchronize users. Production data must come from the central backend.
- Use HTTPS/TLS on the office LAN where feasible, strong per-user credentials, role-based authorization, database backups, and audit logs.
- The backend must calculate and post supplier advance adjustment and payable values. Never trust client-side calculations for accounting.
- Supplier delivery, stock posting, supplier ledger, and journal entries must be committed atomically on the server. Use idempotency keys / unique delivery references to prevent duplicate posting.
- Do not use the demo credentials in production.
- Tamil text uses system fonts with Noto Sans Tamil fallback. For consistent display, install Noto Sans Tamil on client Windows machines or bundle a licensed font.

## Project structure
```text
src/
  App.jsx
  data.js
  styles.css
  services/api.js
electron/
  main.cjs
  preload.cjs
```
