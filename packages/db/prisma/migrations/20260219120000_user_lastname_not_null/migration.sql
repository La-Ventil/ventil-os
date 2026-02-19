-- Ensure lastName is always set before enforcing NOT NULL.
UPDATE "User" SET "lastName" = '' WHERE "lastName" IS NULL;

ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;
