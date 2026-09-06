CREATE TABLE `employeeProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeId` varchar(64),
	`employeeRole` enum('state_admin','city_control','zone_engineer','field_technician','auditor') NOT NULL DEFAULT 'auditor',
	`accessStatus` enum('active','pending','suspended') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employeeProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `employeeProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `employeeProfiles` ADD CONSTRAINT `employeeProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `employeeId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `accessStatus`;