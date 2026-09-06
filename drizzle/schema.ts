import { double, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const employeeRoles = ["state_admin", "city_control", "zone_engineer", "field_technician", "auditor"] as const;

/** Core identity contract required by the built-in OAuth and background-job infrastructure. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** EB-specific authorisation sits beside, rather than replaces, the core user identity. */
export const employeeProfiles = mysqlTable("employeeProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  employeeId: varchar("employeeId", { length: 64 }),
  employeeRole: mysqlEnum("employeeRole", employeeRoles).default("auditor").notNull(),
  accessStatus: mysqlEnum("accessStatus", ["active", "pending", "suspended"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 24 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  centreLat: double("centreLat").notNull(),
  centreLng: double("centreLng").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const zones = mysqlTable("zones", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull().references(() => cities.id),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  centreLat: double("centreLat").notNull(),
  centreLng: double("centreLng").notNull(),
  boundaryGeoJson: text("boundaryGeoJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const transformers = mysqlTable("transformers", {
  id: int("id").autoincrement().primaryKey(),
  zoneId: int("zoneId").notNull().references(() => zones.id),
  assetCode: varchar("assetCode", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  latitude: double("latitude").notNull(),
  longitude: double("longitude").notNull(),
  serviceConnections: int("serviceConnections").default(0).notNull(),
  healthScore: int("healthScore").default(100).notNull(),
  healthState: mysqlEnum("healthState", ["healthy", "watch", "fault", "offline"]).default("healthy").notNull(),
  lastTelemetryAt: timestamp("lastTelemetryAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const telemetrySnapshots = mysqlTable("telemetrySnapshots", {
  id: int("id").autoincrement().primaryKey(),
  transformerId: int("transformerId").notNull().references(() => transformers.id),
  voltage: double("voltage"),
  loadPercent: double("loadPercent"),
  coreTemperature: double("coreTemperature"),
  powerFactor: double("powerFactor"),
  communicationLatencySeconds: double("communicationLatencySeconds"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const employeeAssignments = mysqlTable("employeeAssignments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  scopeType: mysqlEnum("scopeType", ["city", "zone"]).notNull(),
  cityId: int("cityId").references(() => cities.id),
  zoneId: int("zoneId").references(() => zones.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  transformerId: int("transformerId").notNull().references(() => transformers.id),
  category: mysqlEnum("category", ["thermal", "loading", "electrical", "communication"]).notNull(),
  severity: mysqlEnum("severity", ["watch", "high", "critical"]).notNull(),
  status: mysqlEnum("status", ["open", "acknowledged", "resolved"]).default("open").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  detail: text("detail"),
  raisedAt: timestamp("raisedAt").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledgedAt"),
  acknowledgedByUserId: int("acknowledgedByUserId").references(() => users.id),
});

export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  ticketNumber: varchar("ticketNumber", { length: 32 }).notNull().unique(),
  transformerId: int("transformerId").notNull().references(() => transformers.id),
  alertId: int("alertId").references(() => alerts.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  severity: mysqlEnum("severity", ["watch", "high", "critical"]).notNull(),
  status: mysqlEnum("status", ["open", "assigned", "in_progress", "resolved", "closed"]).default("open").notNull(),
  createdByUserId: int("createdByUserId").notNull().references(() => users.id),
  assignedToUserId: int("assignedToUserId").references(() => users.id),
  dueAt: timestamp("dueAt"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const ticketUpdates = mysqlTable("ticketUpdates", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull().references(() => tickets.id),
  authorUserId: int("authorUserId").notNull().references(() => users.id),
  status: mysqlEnum("status", ["open", "assigned", "in_progress", "resolved", "closed"]),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const auditEvents = mysqlTable("auditEvents", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId").references(() => users.id),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: varchar("entityId", { length: 64 }).notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  detail: text("detail"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
