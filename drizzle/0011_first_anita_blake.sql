CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review_of` text NOT NULL,
	`uuid` text NOT NULL,
	`comment` text NOT NULL,
	`rate` integer NOT NULL,
	`commented_on` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
