-- CreateEnum
CREATE TYPE "MachineReservationStatus" AS ENUM ('confirmed', 'cancelled');

-- CreateTable
CREATE TABLE "MachineReservation" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "MachineReservationStatus" NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineReservationParticipant" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MachineReservationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MachineReservation_machineId_startsAt_idx" ON "MachineReservation"("machineId", "startsAt");

-- CreateIndex
CREATE INDEX "MachineReservation_creatorId_startsAt_idx" ON "MachineReservation"("creatorId", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "MachineReservationParticipant_reservationId_userId_key" ON "MachineReservationParticipant"("reservationId", "userId");

-- CreateIndex
CREATE INDEX "MachineReservationParticipant_userId_idx" ON "MachineReservationParticipant"("userId");

-- AddForeignKey
ALTER TABLE "MachineReservation" ADD CONSTRAINT "MachineReservation_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineReservation" ADD CONSTRAINT "MachineReservation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineReservationParticipant" ADD CONSTRAINT "MachineReservationParticipant_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "MachineReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineReservationParticipant" ADD CONSTRAINT "MachineReservationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
