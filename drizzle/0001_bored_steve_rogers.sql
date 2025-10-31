CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`metaPixelId` varchar(100),
	`metaAccessToken` text,
	`whatsappEnabled` boolean NOT NULL DEFAULT false,
	`whatsappWelcomeMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`),
	CONSTRAINT `campaigns_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `leadStatusHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`userId` int,
	`oldStatus` varchar(50),
	`newStatus` varchar(50) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadStatusHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`status` enum('new','contacted','booked','not_interested','no_answer') NOT NULL DEFAULT 'new',
	`source` varchar(100),
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`utmContent` varchar(100),
	`notes` text,
	`emailSent` boolean NOT NULL DEFAULT false,
	`whatsappSent` boolean NOT NULL DEFAULT false,
	`bookingConfirmationSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
