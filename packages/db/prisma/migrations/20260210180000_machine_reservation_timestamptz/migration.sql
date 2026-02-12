-- Convert timestamps to timestamptz (assumes existing values are in Europe/Paris local time)
-- Drop overlap constraint before altering timestamps to avoid tsrange/timestamptz mismatch
ALTER TABLE "MachineReservation"
  DROP CONSTRAINT IF EXISTS "machine_reservation_no_overlap";
ALTER TABLE "User"
  ALTER COLUMN "emailVerified" TYPE timestamptz USING "emailVerified" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "resetTokenExpiry" TYPE timestamptz USING "resetTokenExpiry" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "Account"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "Session"
  ALTER COLUMN "expires" TYPE timestamptz USING "expires" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "VerificationToken"
  ALTER COLUMN "expires" TYPE timestamptz USING "expires" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "UserConsent"
  ALTER COLUMN "acceptedAt" TYPE timestamptz USING "acceptedAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "revokedAt" TYPE timestamptz USING "revokedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "Event"
  ALTER COLUMN "startDate" TYPE timestamptz USING "startDate" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "endDate" TYPE timestamptz USING "endDate" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "EventTemplate"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "EventRegistration"
  ALTER COLUMN "registeredAt" TYPE timestamptz USING "registeredAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "attendedAt" TYPE timestamptz USING "attendedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "OpenBadge"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "OpenBadgeProgress"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "OpenBadgeLevelProgress"
  ALTER COLUMN "awardedAt" TYPE timestamptz USING "awardedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "Machine"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "MachineReservation"
  ALTER COLUMN "startsAt" TYPE timestamptz USING "startsAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "endsAt" TYPE timestamptz USING "endsAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Europe/Paris';

ALTER TABLE "MachineReservation"
  ADD CONSTRAINT "machine_reservation_no_overlap"
  EXCLUDE USING gist (
    "machineId" WITH =,
    tstzrange("startsAt", "endsAt", '[)') WITH &&
  )
  WHERE ("status" = 'confirmed');

ALTER TABLE "MachineReservationParticipant"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Europe/Paris';
