-- Add partial index to speed up availability queries for confirmed reservations
CREATE INDEX "MachineReservation_confirmed_startsAt_endsAt_idx"
ON "MachineReservation"("startsAt", "endsAt")
WHERE "status" = 'confirmed';

-- Also speed up per-machine lookups for confirmed reservations
CREATE INDEX "MachineReservation_confirmed_machineId_startsAt_idx"
ON "MachineReservation"("machineId", "startsAt")
WHERE "status" = 'confirmed';
