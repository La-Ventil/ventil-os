/*
  Warnings:

  - You are about to drop the column `kcSub` on the `User` table. All the data in the column will be lost.
  - Added the required column `iterations` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX IF EXISTS "User_kcSub_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "kcSub",
ADD COLUMN IF NOT EXISTS "iterations" INTEGER NOT NULL,
ADD COLUMN IF NOT EXISTS "password" TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS "resetToken" TEXT,
ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "salt" TEXT NOT NULL;
