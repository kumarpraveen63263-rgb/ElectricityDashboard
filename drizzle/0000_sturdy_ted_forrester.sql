CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transformerId` int NOT NULL,
	`category` enum('thermal','loading','electrical','communication') NOT NULL,
	`severity` enum('watch','high','critical') NOT NULL,
	`status` enum('open','acknowledged','resolved') NOT NULL DEFAULT 'open',
	`title` varchar(200) NOT NULL,
	`detail` text,
	`raisedAt` timestamp NOT NULL DEFAULT (now()),
	`acknowledgedAt` timestamp,
	`acknowledgedByUserId` int,
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`entityType` varchar(64) NOT NULL,
	`entityId` varchar(64) NOT NULL,
	`action` varchar(120) NOT NULL,
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(120) NOT NULL,
	`centreLat` double NOT NULL,
	`centreLng` double NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `cities_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `employeeAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scopeType` enum('city','zone') NOT NULL,
	`cityId` int,
	`zoneId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employeeAssignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `telemetrySnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transformerId` int NOT NULL,
	`voltage` double,
	`loadPercent` double,
	`coreTemperature` double,
	`powerFactor` double,
	`communicationLatencySeconds` double,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `telemetrySnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticketUpdates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`authorUserId` int NOT NULL,
	`status` enum('open','assigned','in_progress','resolved','closed'),
	`note` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticketUpdates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketNumber` varchar(32) NOT NULL,
	`transformerId` int NOT NULL,
	`alertId` int,
	`title` varchar(200) NOT NULL,
	`description` text,
	`severity` enum('watch','high','critical') NOT NULL,
	`status` enum('open','assigned','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`createdByUserId` int NOT NULL,
	`assignedToUserId` int,
	`dueAt` timestamp,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticketNumber_unique` UNIQUE(`ticketNumber`)
);
--> statement-breakpoint
CREATE TABLE `transformers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`zoneId` int NOT NULL,
	`assetCode` varchar(64) NOT NULL,
	`name` varchar(160) NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`serviceConnections` int NOT NULL DEFAULT 0,
	`healthScore` int NOT NULL DEFAULT 100,
	`healthState` enum('healthy','watch','fault','offline') NOT NULL DEFAULT 'healthy',
	`lastTelemetryAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transformers_id` PRIMARY KEY(`id`),
	CONSTRAINT `transformers_assetCode_unique` UNIQUE(`assetCode`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`employeeId` varchar(64),
	`loginMethod` varchar(64),
	`role` enum('state_admin','city_control','zone_engineer','field_technician','auditor') NOT NULL DEFAULT 'auditor',
	`accessStatus` enum('active','pending','suspended') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(120) NOT NULL,
	`centreLat` double NOT NULL,
	`centreLng` double NOT NULL,
	`boundaryGeoJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zones_id` PRIMARY KEY(`id`),
	CONSTRAINT `zones_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_transformerId_transformers_id_fk` FOREIGN KEY (`transformerId`) REFERENCES `transformers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_acknowledgedByUserId_users_id_fk` FOREIGN KEY (`acknowledgedByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auditEvents` ADD CONSTRAINT `auditEvents_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employeeAssignments` ADD CONSTRAINT `employeeAssignments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employeeAssignments` ADD CONSTRAINT `employeeAssignments_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employeeAssignments` ADD CONSTRAINT `employeeAssignments_zoneId_zones_id_fk` FOREIGN KEY (`zoneId`) REFERENCES `zones`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `telemetrySnapshots` ADD CONSTRAINT `telemetrySnapshots_transformerId_transformers_id_fk` FOREIGN KEY (`transformerId`) REFERENCES `transformers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticketUpdates` ADD CONSTRAINT `ticketUpdates_ticketId_tickets_id_fk` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticketUpdates` ADD CONSTRAINT `ticketUpdates_authorUserId_users_id_fk` FOREIGN KEY (`authorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_transformerId_transformers_id_fk` FOREIGN KEY (`transformerId`) REFERENCES `transformers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_alertId_alerts_id_fk` FOREIGN KEY (`alertId`) REFERENCES `alerts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_assignedToUserId_users_id_fk` FOREIGN KEY (`assignedToUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transformers` ADD CONSTRAINT `transformers_zoneId_zones_id_fk` FOREIGN KEY (`zoneId`) REFERENCES `zones`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `zones` ADD CONSTRAINT `zones_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;