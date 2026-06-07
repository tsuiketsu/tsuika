CREATE TABLE "assets" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"file_id" text NOT NULL,
	"size" bigint,
	"mime_type" text,
	"filename" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assets_fileId_unique" UNIQUE("file_id")
);
--> statement-breakpoint
ALTER TABLE "collaborative_folders" ALTER COLUMN "folder_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborative_folders" ALTER COLUMN "owner_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborative_folders" ALTER COLUMN "shared_with_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborative_folders" ALTER COLUMN "permission_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;