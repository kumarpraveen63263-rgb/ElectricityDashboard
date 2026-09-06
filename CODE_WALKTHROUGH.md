# PowerHouse Dashboard — Code Walkthrough

## 1. One-sentence explanation

> This application is a React frontend served by an Express server; React routes render control-room pages, local TypeScript data supplies the educational transformer records, reusable components build the interface, and tRPC is available for typed backend communication.

## 2. Recommended explanation order

### A. `package.json`

This is the project manifest. It lists the dependencies and the commands used by the team:

| Command | Meaning |
|---|---|
| `pnpm run dev` | Starts the Express server with Vite hot reload for development. |
| `pnpm run build` | Builds the React frontend and bundles the server for production. |
| `pnpm start` | Runs the compiled production server. |
| `pnpm run check` | Runs the TypeScript compiler in validation mode. |
| `pnpm test` | Runs the Vitest test suite. |
| `pnpm run db:push` | Generates and applies Drizzle database migrations when database work is enabled. |

The `dependencies` section contains the runtime libraries. The `devDependencies` section contains development and build tools.

### B. `client/src/main.tsx`

This is the browser entry point. It finds the HTML element with `id="root"`, creates a React root, and renders `<App />`. It also installs the providers used by the application, such as the tRPC/React Query client and theme context.

### C. `client/src/App.tsx`

This is the route map. Wouter matches the current URL and renders the correct page:

- `/` → city operations dashboard
- `/zones` → zone monitoring
- `/transformers` → transformer monitoring
- `/tickets` → ticket desk
- `/assignments` → technician assignment board
- `/alerts` → alert centre
- `/load-analysis` → load analysis
- `/login` → employee sign-in screen

`ErrorBoundary`, `ThemeProvider`, `TooltipProvider`, and `Toaster` wrap the routes so that shared behavior is available to every page.

### D. `client/src/components/DashboardLayout.tsx`

This is the shared shell around the dashboard pages. It owns the left navigation, government/TNEB identity area, active navigation state, header, viewing-mode banner, and content area. Pages pass in an `eyebrow`, `title`, and `children` instead of duplicating the shell.

This is a good example of component reuse: one change to the navigation or header updates all dashboard pages.

### E. `client/src/pages/Home.tsx`

This is the city operations centre. It:

1. Chooses the active city.
2. Filters zones, transformers, alerts, and tickets for that city.
3. Calculates summary values such as online transformers and active notices.
4. Renders the map and selected-transformer panel.
5. Links to the deeper zone, transformer, alert, and ticket pages.

The React hooks such as `useState` store the selected city and transformer. Event handlers update those values when the user changes a selector or clicks a map marker.

### F. `client/src/data/controlRoomData.ts` and `client/src/data/zoneData.ts`

These files are the prototype data layer. They define TypeScript types and arrays for cities, zones, transformer assets, telemetry-like values, alerts, tickets, assignments, and load analysis.

For example, the data model describes a transformer with an identifier, zone, latitude/longitude, health score, state, load, temperature, voltage, power factor, and optional fault. This typed shape helps prevent components from reading fields that do not exist.

To change the demonstration values, edit these data files. To replace them with a real data source later, keep the same public data shapes and move the retrieval into backend procedures.

### G. `client/src/components/Map.tsx`

This component loads the map provider script, creates the map, draws the city and zone overlays, and displays transformer markers. It receives values such as `cityId`, `selectedId`, and an `onSelect` callback from the page.

The callback is the important interaction boundary: the map does not own the whole dashboard state. It reports which transformer was clicked, and the page decides how the selected-transformer panel should change.

The map proxy key is read from `import.meta.env.VITE_FRONTEND_FORGE_API_KEY`, so the key belongs in a local environment file rather than in committed source code.

### H. Other page components

The remaining files follow the same page pattern:

- `Zones.tsx` summarizes zone health, coverage, alerts, and ticket load.
- `Transformers.tsx` gives transformer-level telemetry and diagnostic regions.
- `Tickets.tsx` presents the work-ticket workflow.
- `Assignments.tsx` presents technician workload and SLA status.
- `Alerts.tsx` presents active fault notices.
- `LoadAnalysis.tsx` presents city and zone demand analysis.
- `Login.tsx` starts the employee OAuth flow.

Each page composes `DashboardLayout`, reads typed records, derives display values, and renders UI with reusable icons and controls.

### I. `client/src/index.css` and page CSS files

`index.css` contains the global design tokens, fonts, colors, resets, layout utilities, and responsive rules. The page-specific CSS files contain styles for special areas such as the map, loading analysis, public demo, and identity view.

The visual system is named **Civic Operations Atlas**: civic navy, warm paper labels, chalk-like map lines, brass dividers, cyan telemetry accents, and amber/vermilion fault escalation.

### J. `server/_core/index.ts`

This is the server entry point. It:

1. Loads environment variables.
2. Creates an Express application and HTTP server.
3. Adds JSON and URL-encoded body parsers.
4. Registers storage-proxy and OAuth routes.
5. Mounts the tRPC API at `/api/trpc`.
6. Starts Vite in development or serves compiled files in production.
7. Listens on port 3000, or the next available port.

This is why the project is full-stack even though most current dashboard values are local demonstration data.

### K. `server/routers.ts`, `server/db.ts`, and `drizzle/schema.ts`

These files are the backend contract and database foundation:

- `server/routers.ts` defines typed tRPC procedures, including authentication procedures.
- `server/db.ts` creates the Drizzle connection lazily and contains database helper functions such as `upsertUser`.
- `drizzle/schema.ts` defines the MySQL/TiDB table schema, currently including the core `users` table.
- `drizzle/*.sql` contains generated migration history.

The demonstration release leaves live operational records as a future integration. The server and schema scaffolding are present so the application can later add database-backed cities, transformers, alerts, tickets, and audit events.

### L. `server/_core/oauth.ts` and `server/_core/sdk.ts`

These files implement Manus OAuth callback handling. The browser starts login from `client/src/const.ts`; the server validates the state cookie, exchanges the authorization code, fetches user information, upserts the user, creates a session token, and redirects back to the dashboard.

Do not put OAuth secrets in source files. Use environment variables.

### M. Tests

The existing tests are in `server/auth.logout.test.ts` and `server/employeeAccess.test.ts`. They check authentication-related behavior and employee access logic. Run them with:

```bash
pnpm test
```

## 3. Example request flow to explain

Use this simple story when presenting the code:

1. A user opens `/transformers?asset=AVD-TX-027`.
2. `App.tsx` matches `/transformers` and renders `Transformers.tsx`.
3. The page reads the `asset` query parameter and finds the asset using `getTransformer()`.
4. `getTransformer()` searches the typed transformer collection in `zoneData.ts`.
5. The page finds the asset's zone with `getZone()` and renders health, load, temperature, voltage, power factor, incidents, and diagnostic regions.
6. A button or link can navigate to `/tickets` so the monitored issue can become a field action.

This demonstrates routing, URL state, typed data lookup, derived UI state, component composition, and navigation in one example.

## 4. Important honesty points during a demonstration

Call this a **realistic educational control-room demonstration**. The current records are illustrative. Live SCADA/MQTT ingestion, production database ticket writes, official employee assignment enforcement, and official geographic/source datasets were intentionally deferred.

That is not a weakness in the code explanation: it shows a clear separation between the present user interface prototype and the future operational integration layer.
