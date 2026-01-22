/*
  Warnings:

  - Made the column `maxParticipants` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roomId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `templateId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_templateId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "maxParticipants" SET NOT NULL,
ALTER COLUMN "maxParticipants" SET DEFAULT 0,
ALTER COLUMN "roomId" SET NOT NULL,
ALTER COLUMN "templateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EventTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
