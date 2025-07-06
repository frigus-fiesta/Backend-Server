CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`full_name` text,
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
	`email` text,
	`registration_date` text,
	`reviews` text
);
