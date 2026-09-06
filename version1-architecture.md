# Version 1 Government Control Room

## Product Purpose

The Tamil Nadu Electricity Board control room gives authorised EB employees a city-to-transformer operational view. The application is desktop-first and light theme only. Each employee sees only the cities, zones, transformers, tickets, and actions assigned to their role.

## Roles and Access

| Role | Geographic scope | Primary permissions |
|---|---|---|
| State Admin | State-wide | Manage users, city assignments, system settings, reports, and audit records. |
| City Control Officer | Assigned city or cities | Monitor zones, create and assign tickets, acknowledge alerts, view city reports. |
| Zone Engineer | Assigned zone or zones | Inspect transformers, raise tickets, update field status, add maintenance notes. |
| Field Technician | Assigned tickets | View assigned transformer context, update ticket progress, upload field notes, resolve work. |
| Read-only Auditor | Explicitly granted scope | View monitoring, tickets, alerts, reports, and audit history without changes. |

## Version 1 Pages

| Route | Page | Main purpose |
|---|---|---|
| `/login` | Employee Login | Authenticate EB employee and establish role-scoped access. |
| `/` | City Operations Centre | Choose a city and monitor all assigned zones, active faults, service coverage, and open ticket load. |
| `/zones` | Zone Monitoring | Examine health, feeder/coverage context, alerts, and ticket load by zone. |
| `/transformers` | Transformer Monitoring | Choose zone and transformer; inspect live-style telemetry, diagnostic regions, health trend, incidents, and service coverage. |
| `/tickets` | Ticket Desk | Raise, filter, triage, and view fault or maintenance tickets. |
| `/assignments` | Assignment Board | Assign technicians, track SLA, work status, and overdue escalation. |
| `/alerts` | Alert Centre | Acknowledge active notices and convert relevant events into tickets. |
| `/reports` | Reports | City, zone, transformer, ticket-SLA, and recurring-fault summaries. |

## Operational Records

The database model requires users, access assignments, cities, zones, transformers, telemetry snapshots, alert notices, tickets, ticket assignments, ticket updates, and audit events. Initial on-screen values remain demonstration data until authorised TNEB telemetry and geographic datasets are supplied.

## Mapping Standard

Maps must use a true base-map surface. City and zone boundaries, transformer markers, service-coverage areas, labels, and selection state are native map overlays. Every overlay must move and scale with the map during panning and zooming; no image layer may be used as a substitute for geography.
