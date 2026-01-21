/*
  Warnings:

  - You are about to drop the column `contenu` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `adminGlobal` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminPedagogique` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bloque` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `niveauScolaire` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pseudo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sousProfilEleve` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sousProfilExterne` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ConsentementUtilisateur` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('terms');

-- CreateEnum
CREATE TYPE "Profile" AS ENUM ('student', 'teacher', 'external');

-- CreateEnum
CREATE TYPE "StudentProfile" AS ENUM ('visitor', 'member', 'alumni');

-- CreateEnum
CREATE TYPE "ExternalProfile" AS ENUM ('contributor', 'visitor');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('registered', 'attended', 'cancelled', 'noShow');

-- CreateEnum
CREATE TYPE "OpenBadgeRequirementRule" AS ENUM ('all', 'any');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "ConsentementUtilisateur" DROP CONSTRAINT "ConsentementUtilisateur_utilisateurId_fkey";

-- DropIndex
DROP INDEX "User_pseudo_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "contenu",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminGlobal",
DROP COLUMN "adminPedagogique",
DROP COLUMN "bloque",
DROP COLUMN "niveauScolaire",
DROP COLUMN "nom",
DROP COLUMN "prenom",
DROP COLUMN "profil",
DROP COLUMN "pseudo",
DROP COLUMN "sousProfilEleve",
DROP COLUMN "sousProfilExterne",
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "externalProfile" "ExternalProfile",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "globalAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "pedagogicalAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile" "Profile" NOT NULL,
ADD COLUMN     "studentProfile" "StudentProfile",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "ConsentementUtilisateur";

-- DropEnum
DROP TYPE "ConsentementType";

-- DropEnum
DROP TYPE "Profil";

-- DropEnum
DROP TYPE "SousProfilEleve";

-- DropEnum
DROP TYPE "SousProfilExterne";

-- CreateTable
CREATE TABLE "UserConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ConsentType" NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "UserConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxParticipants" INTEGER,
    "creatorId" TEXT NOT NULL,
    "roomId" TEXT,
    "templateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "description" TEXT NOT NULL,
    "profiles" "Profile"[],
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'registered',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendedAt" TIMESTAMP(3),

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenBadge" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverImage" TEXT,
    "awardedPdfUrl" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'active',
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "trainerThresholdLevelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenBadgeLevel" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "openBadgeId" TEXT NOT NULL,

    CONSTRAINT "OpenBadgeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenBadgeProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "openBadgeId" TEXT NOT NULL,
    "highestLevelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenBadgeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenBadgeLevelProgress" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "openBadgeLevelId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardedById" TEXT NOT NULL,

    CONSTRAINT "OpenBadgeLevelProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "roomId" TEXT,
    "reservationCalendarUrl" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'active',
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineOpenBadgeRequirement" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "requiredOpenBadgeId" TEXT NOT NULL,
    "requiredOpenBadgeLevelId" TEXT,
    "ruleType" "OpenBadgeRequirementRule" NOT NULL DEFAULT 'all',

    CONSTRAINT "MachineOpenBadgeRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER,
    "eventCalendarUrl" TEXT,
    "locationId" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserConsent_userId_type_key" ON "UserConsent"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_userId_key" ON "EventRegistration"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenBadgeLevel_openBadgeId_level_key" ON "OpenBadgeLevel"("openBadgeId", "level");

-- CreateIndex
CREATE INDEX "OpenBadgeProgress_openBadgeId_highestLevelId_idx" ON "OpenBadgeProgress"("openBadgeId", "highestLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenBadgeProgress_userId_openBadgeId_key" ON "OpenBadgeProgress"("userId", "openBadgeId");

-- CreateIndex
CREATE INDEX "OpenBadgeLevelProgress_progressId_awardedAt_idx" ON "OpenBadgeLevelProgress"("progressId", "awardedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "OpenBadgeLevelProgress_progressId_openBadgeLevelId_key" ON "OpenBadgeLevelProgress"("progressId", "openBadgeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "MachineOpenBadgeRequirement_machineId_requiredOpenBadgeId_r_key" ON "MachineOpenBadgeRequirement"("machineId", "requiredOpenBadgeId", "requiredOpenBadgeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserConsent" ADD CONSTRAINT "UserConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EventTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTemplate" ADD CONSTRAINT "EventTemplate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadge" ADD CONSTRAINT "OpenBadge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadge" ADD CONSTRAINT "OpenBadge_trainerThresholdLevelId_fkey" FOREIGN KEY ("trainerThresholdLevelId") REFERENCES "OpenBadgeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeLevel" ADD CONSTRAINT "OpenBadgeLevel_openBadgeId_fkey" FOREIGN KEY ("openBadgeId") REFERENCES "OpenBadge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeProgress" ADD CONSTRAINT "OpenBadgeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeProgress" ADD CONSTRAINT "OpenBadgeProgress_openBadgeId_fkey" FOREIGN KEY ("openBadgeId") REFERENCES "OpenBadge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeProgress" ADD CONSTRAINT "OpenBadgeProgress_highestLevelId_fkey" FOREIGN KEY ("highestLevelId") REFERENCES "OpenBadgeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeLevelProgress" ADD CONSTRAINT "OpenBadgeLevelProgress_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "OpenBadgeProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeLevelProgress" ADD CONSTRAINT "OpenBadgeLevelProgress_openBadgeLevelId_fkey" FOREIGN KEY ("openBadgeLevelId") REFERENCES "OpenBadgeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenBadgeLevelProgress" ADD CONSTRAINT "OpenBadgeLevelProgress_awardedById_fkey" FOREIGN KEY ("awardedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOpenBadgeRequirement" ADD CONSTRAINT "MachineOpenBadgeRequirement_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOpenBadgeRequirement" ADD CONSTRAINT "MachineOpenBadgeRequirement_requiredOpenBadgeId_fkey" FOREIGN KEY ("requiredOpenBadgeId") REFERENCES "OpenBadge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOpenBadgeRequirement" ADD CONSTRAINT "MachineOpenBadgeRequirement_requiredOpenBadgeLevelId_fkey" FOREIGN KEY ("requiredOpenBadgeLevelId") REFERENCES "OpenBadgeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
