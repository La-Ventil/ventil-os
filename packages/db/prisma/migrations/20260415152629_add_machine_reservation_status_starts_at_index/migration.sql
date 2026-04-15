-- CreateIndex
CREATE INDEX "MachineReservation_status_startsAt_idx" ON "MachineReservation"("status", "startsAt");
