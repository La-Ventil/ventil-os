-- Ensure GiST supports equality on text (machineId) for exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent overlapping confirmed reservations for the same machine
ALTER TABLE "MachineReservation"
ADD CONSTRAINT "machine_reservation_no_overlap"
EXCLUDE USING gist (
  "machineId" WITH =,
  tstzrange("startsAt", "endsAt", '[)') WITH &&
)
WHERE ("status" = 'confirmed');
