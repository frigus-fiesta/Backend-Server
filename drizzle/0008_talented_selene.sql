PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL ,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`full_name` text NOT NULL,
	`avatar_url` text,
	`phone` text,
	`address` text,
	`city` text,
	`state` text,
	`pincode` text,
	`updated_at` text,
	`email_notifications` text,
	`bio` text,
	`user_login_info` text,
	`email` text NOT NULL,
	`registration_date` text,
	`reviews` text
);
--> statement-breakpoint
INSERT INTO `__new_profiles`("id", "uuid", "created_at", "full_name", "avatar_url", "phone", "address", "city", "state", "pincode", "updated_at", "email_notifications", "bio", "user_login_info", "email", "registration_date", "reviews") SELECT "id", "uuid", "created_at", "full_name", "avatar_url", "phone", "address", "city", "state", "pincode", "updated_at", "email_notifications", "bio", "user_login_info", "email", "registration_date", "reviews" FROM `profiles`;--> statement-breakpoint
DROP TABLE `profiles`;--> statement-breakpoint
ALTER TABLE `__new_profiles` RENAME TO `profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_uuid_unique` ON `profiles` (`uuid`);