import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

import { mqttManager } from "../mqttService";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Live MQTT Telemetry REST & SSE Stream for AVD-TX-027
  app.get("/api/telemetry/AVD-TX-027", (_req, res) => {
    res.json(mqttManager.getTelemetry());
  });

  app.post("/api/telemetry/AVD-TX-027", (req, res) => {
    mqttManager.publishTelemetry(req.body);
    res.json({ success: true, updated: mqttManager.getTelemetry().payload });
  });

  app.get("/api/telemetry/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendData = (payload: any) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    sendData(mqttManager.getTelemetry());

    const listener = () => {
      sendData(mqttManager.getTelemetry());
    };

    mqttManager.on("telemetry", listener);

    req.on("close", () => {
      mqttManager.off("telemetry", listener);
    });
  });

  // Live Ticket Synchronization API (Web & Mobile Apps)
  let ticketStore = [
    { id: "TNEB-2026-041", transformerId: "AMT-TX-008", zone: "Ambattur", title: "Review low PF at Industrial Estate", severity: "high", status: "Assigned", assignee: "K. Suresh", due: "Today, 14:00", updated: "8 min ago" },
    { id: "TNEB-2026-042", transformerId: "AVD-TX-027", zone: "Avadi", title: "Perform baseline scan", severity: "watch", status: "Open", assignee: "Unassigned", due: "Today, 16:30", updated: "12 min ago" },
    { id: "TNEB-2026-037", transformerId: "AMT-TX-042", zone: "Ambattur", title: "Assess loading redistribution", severity: "watch", status: "In progress", assignee: "S. Deepa", due: "Tomorrow, 10:00", updated: "24 min ago" },
    { id: "TNEB-2026-046", transformerId: "PLM-TX-024", zone: "Peelamedu", title: "Dispatch overload inspection", severity: "critical", status: "Assigned", assignee: "M. Pravin", due: "Today, 13:15", updated: "3 min ago" },
  ];

  app.get("/api/tickets", (_req, res) => {
    res.json({ success: true, count: ticketStore.length, tickets: ticketStore });
  });

  app.post("/api/tickets", (req, res) => {
    const newTicket = {
      id: req.body.id || `TNEB-2026-0${Math.floor(50 + Math.random() * 50)}`,
      transformerId: req.body.transformerId || "AVD-TX-027",
      zone: req.body.zone || "Avadi",
      title: req.body.title || "Field Inspection Required",
      severity: req.body.severity || "watch",
      status: req.body.status || "Open",
      assignee: req.body.assignee || "Unassigned",
      due: req.body.due || "Today, 18:00",
      updated: "Just now",
    };
    ticketStore.unshift(newTicket);
    mqttManager.emit("ticket_update", ticketStore);
    res.status(201).json({ success: true, ticket: newTicket, tickets: ticketStore });
  });

  app.patch("/api/tickets/:id", (req, res) => {
    const { id } = req.params;
    const index = ticketStore.findIndex((t) => t.id === id);
    if (index !== -1) {
      ticketStore[index] = { ...ticketStore[index], ...req.body, updated: "Just now" };
      mqttManager.emit("ticket_update", ticketStore);
      res.json({ success: true, ticket: ticketStore[index] });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  });

  app.get("/api/tickets/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendTickets = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendTickets(ticketStore);

    const listener = (updatedTickets: any) => {
      sendTickets(updatedTickets);
    };

    mqttManager.on("ticket_update", listener);
    req.on("close", () => {
      mqttManager.off("ticket_update", listener);
    });
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
