CREATE TABLE `Attachment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Board` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#e0e0e0' NOT NULL,
	`image_id` text,
	`image_thumb_url` text,
	`image_full_url` text,
	`image_username` text,
	`image_link_HTML` text,
	`created_at` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `Column` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`order` real NOT NULL,
	`board_id` integer NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Cover` (
	`id` text PRIMARY KEY NOT NULL,
	`color` text,
	`url` text,
	`item_id` text NOT NULL,
	`attachment_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`attachment_id`) REFERENCES `Attachment`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Item` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`order` real NOT NULL,
	`column_id` text NOT NULL,
	`board_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`column_id`) REFERENCES `Column`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` numeric NOT NULL,
	`created_at` numeric NOT NULL,
	`updated_at` numeric NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Cover_attachmentId_key` ON `Cover` (`attachment_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Cover_itemId_key` ON `Cover` (`item_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_key` ON `User` (`email`);