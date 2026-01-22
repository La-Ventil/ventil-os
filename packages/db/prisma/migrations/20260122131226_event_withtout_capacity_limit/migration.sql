/*
  Warnings:

  - Made the column `title` on table `OpenBadgeLevel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "maxParticipants" DROP NOT NULL,
ALTER COLUMN "maxParticipants" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OpenBadgeLevel" ALTER COLUMN "title" SET NOT NULL;
