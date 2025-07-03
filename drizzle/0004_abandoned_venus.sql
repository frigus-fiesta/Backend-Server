PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_eventInfo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	`eventDate` text NOT NULL,
	`tagline` text NOT NULL,
	`eventStatus` text NOT NULL,
	`category` text NOT NULL,
	`hostedBy` text NOT NULL,
	`venue` text,
	`imageGallery` text,
	`eventPrice` real,
	`ticketPricingList` text,
	`importantInfo` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_eventInfo`("id", "title", "description", "slug", "eventDate", "tagline", "eventStatus", "category", "hostedBy", "venue", "imageGallery", "eventPrice", "ticketPricingList", "importantInfo", "createdAt", "updatedAt") SELECT "id", "title", "description", "slug", "eventDate", "tagline", "eventStatus", "category", "hostedBy", "venue", "imageGallery", "eventPrice", "ticketPricingList", "importantInfo", "createdAt", "updatedAt" FROM `eventInfo`;--> statement-breakpoint
DROP TABLE `eventInfo`;--> statement-breakpoint
ALTER TABLE `__new_eventInfo` RENAME TO `eventInfo`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `eventInfo_slug_unique` ON `eventInfo` (`slug`);--> statement-breakpoint