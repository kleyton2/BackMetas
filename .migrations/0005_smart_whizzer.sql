ALTER TABLE "goals" DROP CONSTRAINT "goals_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "goals" DROP COLUMN IF EXISTS "user_id";