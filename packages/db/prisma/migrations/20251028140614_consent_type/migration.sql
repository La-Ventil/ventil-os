/*
  Warnings:

  - You are about to drop the column `consentementTypeId` on the `ConsentementUtilisateur` table. All the data in the column will be lost.
  - You are about to drop the `ConsentementType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[utilisateurId,type]` on the table `ConsentementUtilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `ConsentementUtilisateur` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "ConsentementUtilisateur" DROP CONSTRAINT "ConsentementUtilisateur_consentementTypeId_fkey";

-- DropIndex
DROP INDEX "ConsentementUtilisateur_utilisateurId_consentementTypeId_key";

-- AlterTable
ALTER TABLE "ConsentementUtilisateur" DROP COLUMN "consentementTypeId";

-- DropTable
DROP TABLE "ConsentementType";

-- CreateEnum
CREATE TYPE "ConsentementType" AS ENUM ('cgu');

-- AlterTable
ALTER TABLE "ConsentementUtilisateur" ADD COLUMN "type" "ConsentementType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConsentementUtilisateur_utilisateurId_type_key" ON "ConsentementUtilisateur"("utilisateurId", "type");
