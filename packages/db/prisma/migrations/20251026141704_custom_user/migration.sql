/*
  Warnings:

  - A unique constraint covering the columns `[kcSub]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pseudo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kcSub` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profil` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pseudo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Profil" AS ENUM ('eleve', 'enseignantcontrecontre', 'personneExterne');

-- CreateEnum
CREATE TYPE "SousProfilEleve" AS ENUM ('visiteur', 'ventilacteur', 'alumni');

-- CreateEnum
CREATE TYPE "SousProfilExterne" AS ENUM ('intervenant', 'visiteur');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminGlobal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adminPedagogique" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bloque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kcSub" TEXT NOT NULL,
ADD COLUMN     "niveauScolaire" TEXT,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "prenom" TEXT NOT NULL,
ADD COLUMN     "profil" "Profil" NOT NULL,
ADD COLUMN     "pseudo" TEXT NOT NULL,
ADD COLUMN     "sousProfilEleve" "SousProfilEleve",
ADD COLUMN     "sousProfilExterne" "SousProfilExterne";

-- CreateTable
CREATE TABLE "ConsentementType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "obligatoire" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMaj" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentementUtilisateur" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "consentementTypeId" TEXT NOT NULL,
    "accepte" BOOLEAN NOT NULL DEFAULT false,
    "accepteAt" TIMESTAMP(3),
    "retireAt" TIMESTAMP(3),

    CONSTRAINT "ConsentementUtilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsentementType_code_key" ON "ConsentementType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentementUtilisateur_utilisateurId_consentementTypeId_key" ON "ConsentementUtilisateur"("utilisateurId", "consentementTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_kcSub_key" ON "User"("kcSub");

-- CreateIndex
CREATE UNIQUE INDEX "User_pseudo_key" ON "User"("pseudo");

-- AddForeignKey
ALTER TABLE "ConsentementUtilisateur" ADD CONSTRAINT "ConsentementUtilisateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentementUtilisateur" ADD CONSTRAINT "ConsentementUtilisateur_consentementTypeId_fkey" FOREIGN KEY ("consentementTypeId") REFERENCES "ConsentementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
