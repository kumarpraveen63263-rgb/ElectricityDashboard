import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { alerts, auditEvents, cities, employeeAssignments, employeeProfiles, InsertUser, ticketUpdates, tickets, transformers, users, zones } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateEmployeeProfile(user: { id: number; role: "user" | "admin" }) {
  const db = await getDb();
  if (!db) return { employeeRole: user.role === "admin" ? "state_admin" : "auditor", accessStatus: user.role === "admin" ? "active" : "pending", assignments: [] } as const;
  const existing = await db.select().from(employeeProfiles).where(eq(employeeProfiles.userId, user.id)).limit(1);
  let profile = existing[0];
  if (!profile) {
    const employeeRole = user.role === "admin" ? "state_admin" : "auditor";
    const accessStatus = user.role === "admin" ? "active" : "pending";
    await db.insert(employeeProfiles).values({ userId: user.id, employeeRole, accessStatus });
    profile = (await db.select().from(employeeProfiles).where(eq(employeeProfiles.userId, user.id)).limit(1))[0];
  }
  const assignments = await db.select().from(employeeAssignments).where(eq(employeeAssignments.userId, user.id));
  return { employeeRole: profile.employeeRole, accessStatus: profile.accessStatus, assignments };
}

export async function getScopedControlRoomRecords(user: { id: number; role: "user" | "admin" }) {
  const db = await getDb();
  const profile = await getOrCreateEmployeeProfile(user);
  if (!db || profile.accessStatus !== "active") return { profile, cities: [], zones: [], transformers: [], alerts: [], tickets: [] };

  const [allCities, allZones, allTransformers, allAlerts, allTickets] = await Promise.all([
    db.select().from(cities), db.select().from(zones), db.select().from(transformers), db.select().from(alerts), db.select().from(tickets),
  ]);
  const unrestricted = profile.employeeRole === "state_admin";
  const assignedCities = new Set(profile.assignments.flatMap((assignment) => assignment.cityId ? [assignment.cityId] : []));
  const assignedZones = new Set(profile.assignments.flatMap((assignment) => assignment.zoneId ? [assignment.zoneId] : []));
  const scopedCities = unrestricted ? allCities : allCities.filter((city) => assignedCities.has(city.id));
  const scopedZones = unrestricted ? allZones : allZones.filter((zone) => assignedCities.has(zone.cityId) || assignedZones.has(zone.id));
  const scopedZoneIds = new Set(scopedZones.map((zone) => zone.id));
  const scopedTransformers = unrestricted ? allTransformers : allTransformers.filter((asset) => scopedZoneIds.has(asset.zoneId));
  const scopedTransformerIds = new Set(scopedTransformers.map((asset) => asset.id));
  return {
    profile,
    cities: scopedCities,
    zones: scopedZones,
    transformers: scopedTransformers,
    alerts: unrestricted ? allAlerts : allAlerts.filter((alert) => scopedTransformerIds.has(alert.transformerId)),
    tickets: unrestricted ? allTickets : allTickets.filter((ticket) => scopedTransformerIds.has(ticket.transformerId)),
  };
}

export async function createScopedTicket(input: { user: { id: number; role: "user" | "admin" }; transformerId: number; title: string; description?: string; severity: "watch" | "high" | "critical"; dueAt?: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Operational database is unavailable");
  const scope = await getScopedControlRoomRecords(input.user);
  if (scope.profile.accessStatus !== "active") throw new Error("Employee access is not active");
  if (!scope.transformers.some((asset) => asset.id === input.transformerId)) throw new Error("Transformer is outside the assigned operating scope");
  const ticketNumber = `TNEB-${new Date().getUTCFullYear()}-${String(Date.now()).slice(-6)}`;
  await db.insert(tickets).values({ ticketNumber, transformerId: input.transformerId, title: input.title, description: input.description, severity: input.severity, status: "open", createdByUserId: input.user.id, dueAt: input.dueAt });
  const record = (await db.select().from(tickets).where(eq(tickets.ticketNumber, ticketNumber)).limit(1))[0];
  await db.insert(ticketUpdates).values({ ticketId: record.id, authorUserId: input.user.id, status: "open", note: "Ticket raised from the government control room." });
  await db.insert(auditEvents).values({ actorUserId: input.user.id, entityType: "ticket", entityId: String(record.id), action: "created", detail: `Created ${ticketNumber} for transformer ${input.transformerId}.` });
  return record;
}

export async function acknowledgeScopedAlert(input: { user: { id: number; role: "user" | "admin" }; alertId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Operational database is unavailable");
  const scope = await getScopedControlRoomRecords(input.user);
  if (scope.profile.accessStatus !== "active") throw new Error("Employee access is not active");
  const alert = scope.alerts.find((item) => item.id === input.alertId);
  if (!alert) throw new Error("Alert is outside the assigned operating scope");
  await db.update(alerts).set({ status: "acknowledged", acknowledgedAt: new Date(), acknowledgedByUserId: input.user.id }).where(eq(alerts.id, input.alertId));
  await db.insert(auditEvents).values({ actorUserId: input.user.id, entityType: "alert", entityId: String(input.alertId), action: "acknowledged", detail: `Acknowledged alert ${input.alertId}.` });
  return { success: true } as const;
}
