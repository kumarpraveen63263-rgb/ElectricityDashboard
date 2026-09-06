# Monitoring Command Centre Redesign

- [x] Replace simulator-oriented navigation, terminology, and primary calls to action with live monitoring language.
- [x] Create two monitored zones: Avadi and Ambattur, each with a coverage map, transformer locations, live telemetry status, and health summary.
- [x] Add a zone selector and a distinctive map-first command layout for government-side operations.
- [x] Implement transformer drill-down details including health, voltage, load, temperature, power factor, and coverage/service context.
- [x] Replace training actions with fault alerts, notification toast behaviour, acknowledgement actions, and an active fault register.
- [x] Redesign the visual language away from generic dashboard cards toward a unique civic operations atlas with route lines, zone plaques, utility labels, and restrained technical detail.
- [x] Verify desktop and mobile map-monitoring views, run type and production builds, then save a new checkpoint.

## Map Anchors

The monitoring map centres use **Avadi: 13.114656, 80.089645** and **Ambattur: 13.09978, 80.15804**. These verified place anchors are used only to orient the two-zone command view; all transformer locations and health values remain simulation data for the dashboard prototype.

## Version 1 Government Control Room

- [x] Define role-scoped access for State Admin, City Control Officer, Zone Engineer, Field Technician, and Read-only Auditor.
- [x] Upgrade the project for authenticated users and persistent operational records.
- [x] Replace the dark visual system with a responsive, light-only government operations theme.
- [x] Build employee login, city monitoring, zone monitoring, transformer detail, ticket desk, assignment board, alert centre, and reports pages.
- [x] Replace the static atlas effect with a true calibrated interactive map: all boundaries, markers, labels, and coverage areas must pan and zoom together.
- [x] Defer ticket write actions and audit mutations: the Ticket Desk remains a realistic demonstration workflow without database writes.
- [x] Defer restricted-employee access-scenario validation: the access scaffold remains in place but role assignments are not required for the demonstration release.
- [x] Keep visible records as demonstration data: assignment-scoped record rendering is deferred until an authorised operational data source is supplied.
- [x] Retain static city, zone, transformer, alert, and ticket records for the demonstration release; database-backed records are deferred.
- [x] Replace the non-geographic map fallback with a verified real base map whose boundaries, markers, labels, and coverage overlays remain geographically calibrated during pan and zoom.

## City and Government Identity Expansion

- [x] Add additional transformer assets and varied health states to Avadi and Ambattur monitoring views.
- [x] Add Coimbatore as a selectable city with three monitored zones, calibrated map boundaries, coverage areas, and transformer points.
- [x] Add Tamil Nadu Government and Tamil Nadu Electricity Board visual marks to the login, masthead, and command shell.
- [x] Retain the current institutional-style identity visuals for the demonstration release; production-approved source files are deferred.
- [x] Refine the expanded navigation, city summary, maps, and operating registers so the dashboard continues to feel like a realistic government command centre.
- [x] Validate the Avadi, Ambattur, and Coimbatore routes at desktop size, test the revised build, and save a checkpoint.

## Demonstration Release Scope

- [x] Record the user-confirmed decision that live operational data, database-backed write actions, restricted-scope testing, and production-approved identity files are out of scope for this demonstration release.

## Zone Load Analysis

- [x] Rename the Reports navigation entry and route to Load Analysis.
- [x] Create illustrative year-on-year residential, apartment, and commercial load-growth records for Chennai and Coimbatore zones.
- [x] Build a zone-analysis view with growth trends, forecast demand, capacity headroom, overload horizon, and transformer upgrade recommendations.
- [x] Add a government-action register that prioritises zones requiring a capacity survey, load balancing, feeder augmentation, or transformer upgrade.
- [x] Validate the Chennai and Coimbatore analysis states, run type checks and the production build, then save a checkpoint.
- [x] Add an explicit commercial-growth metric to every zone forecast and surface it in the selected-zone planning trigger.

## Sidebar Notice

- [x] Replace the sidebar session and administrator-scope status wording with the single notice: “Educational Purpose Only”.

## Public Demonstration Access

- [x] Remove the employee approval and sign-in gate from visitor-facing dashboard routes while retaining educational-purpose disclosure.
- [x] Replace the header employee identity and access-scope ribbon with a neutral Public Demonstration status.
- [x] Save a new checkpoint after verifying unauthenticated public access to city operations and Load Analysis in the final public mode.
