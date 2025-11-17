-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetToken" DROP NOT NULL,
ALTER COLUMN "resetTokenExpiry" DROP NOT NULL;
