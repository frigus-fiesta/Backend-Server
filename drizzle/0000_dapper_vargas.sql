CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`tagline` text,
	`description` text,
	`slug` text NOT NULL,
	`event_status` text NOT NULL,
	`category` text NOT NULL,
	`event_price` real NOT NULL,
	`event_date` text NOT NULL,
	`venue` text NOT NULL,
	`hosted_by` text NOT NULL,
	`event_timeline` text NOT NULL,
	`image_gallery` text NOT NULL,
	`about_the_host` text,
	`event_highlights` text NOT NULL,
	`important_info` text NOT NULL,
	`ticket_pricing_list` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);