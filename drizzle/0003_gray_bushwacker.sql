CREATE TABLE `eventInfo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	`eventDate` text NOT NULL,
	`tagline` text,
	`eventStatus` text NOT NULL,
	`category` text NOT NULL,
	`hostedBy` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `eventInfo_slug_unique` ON `eventInfo` (`slug`);--> statement-breakpoint
ALTER TABLE `events` ADD `eventStatus` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `eventPrice` real NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `eventDate` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `hostedBy` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `eventTimeline` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `imageGallery` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `aboutTheHost` text;--> statement-breakpoint
ALTER TABLE `events` ADD `eventHighlights` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `importantInfo` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `ticketPricingList` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `event_status`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `event_price`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `event_date`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `hosted_by`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `event_timeline`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `image_gallery`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `about_the_host`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `event_highlights`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `important_info`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `ticket_pricing_list`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `updated_at`;