# PowerHouse Dashboard — Local Setup

This package contains the completed source code for the **Tamil Nadu Transformer Fault Diagnosis Dashboard**, also called **Transformer Health Command** in the interface.

## 1. What is included

The project is a full-stack TypeScript application:

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Wouter, Recharts, and Lucide icons.
- **Backend:** Node.js, Express, and tRPC.
- **Data layer:** Drizzle ORM with MySQL/TiDB support.
- **Authentication scaffolding:** Manus OAuth routes are present, but the delivered demonstration does not require login to view its public educational screens.
- **Demonstration data:** Transformer, zone, alert, ticket, and load-analysis records are stored in `client/src/data/` for the prototype.

The archive deliberately excludes `node_modules`, build output, Git metadata, WebDev metadata, logs, and all private credentials.

## 2. Install prerequisites

Install the following on your laptop:

1. **Node.js 20 or 22 LTS** from <https://nodejs.org/>.
2. **Git**, optional but recommended, from <https://git-scm.com/downloads>.
3. **pnpm 10.4.1**. After installing Node.js, open a new terminal and run one of these commands:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

If Corepack is not available, use:

```bash
npm install --global pnpm@10.4.1
```

Check the installation:

```bash
node --version
pnpm --version
```

## 3. Extract and install the project

Extract `powerhouse-dashboard-source.zip` to a folder such as `Documents/PowerHouse`.

Open a terminal inside the extracted folder. The folder must contain `package.json`.

```bash
cd path/to/PowerHouse
pnpm install
```

For Windows PowerShell, an example is:

```powershell
cd "$HOME\Documents\PowerHouse"
pnpm install
```

## 4. Start the dashboard locally

```bash
pnpm run dev
```

Then open the URL printed in the terminal, normally:

<http://localhost:3000>

The application automatically chooses the next available port if port 3000 is busy. Always use the URL printed by the terminal.

Stop the server with `Ctrl+C`.

## 5. Run quality checks

Run these commands from the project folder:

```bash
pnpm test
pnpm run check
pnpm run build
```

- `pnpm test` runs the Vitest tests.
- `pnpm run check` runs TypeScript without emitting files.
- `pnpm run build` creates the production bundle.

## 6. Environment variables

For the current public educational demonstration, the main pages use local demonstration data and can be viewed without creating a `.env` file. The server may print an OAuth configuration warning; that warning is expected when cloud authentication variables are not supplied.

A blank-safe template is included as `.env.example`. Copy it only if you want to experiment with optional integrations:

```bash
cp .env.example .env
```

Do **not** copy credentials from screenshots, chat messages, or the WebDev project metadata into a public repository. Ask the project owner for newly issued development credentials if cloud login, database access, or the Google Maps proxy is required.

### Optional integrations

| Feature | Variables needed | Current status |
|---|---|---|
| Public dashboard screens | None | Works with demonstration data |
| Google Maps surface | `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY` | Optional; without them the map can show its fallback state |
| Manus employee login | `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `JWT_SECRET`, `OWNER_OPEN_ID` | Optional authentication scaffolding |
| Database-backed features | `DATABASE_URL` | Not required by the current demonstration pages |
| Manus server APIs | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Only needed by features that call those APIs |

Never commit `.env` to Git. It is ignored by `.gitignore` for this reason.

## 7. How to explain the code

Start with the browser-to-screen flow:

1. `client/src/main.tsx` creates the React root and providers.
2. `client/src/App.tsx` defines the Wouter routes.
3. A route loads a page such as `client/src/pages/Home.tsx`.
4. The page reads demonstration records from `client/src/data/controlRoomData.ts` and `client/src/data/zoneData.ts`.
5. Shared UI is assembled from `client/src/components/`, especially `DashboardLayout.tsx` and `Map.tsx`.
6. Global styling is defined in `client/src/index.css` and page-specific styling files.
7. If a backend request is needed, the browser uses the typed tRPC client in `client/src/lib/trpc.ts`, which reaches the Express server at `/api/trpc`.

Read `CODE_WALKTHROUGH.md` for a file-by-file explanation and a suggested presentation order.

## 8. Important project scope

This is a realistic **control-room demonstration**, not a live electricity-board system. The current release intentionally uses illustrative interface records. Live SCADA/MQTT ingestion, production ticket writes, real employee assignment enforcement, and official source datasets were deferred for a later operational integration.

That distinction should be stated when demonstrating the project to another person.
