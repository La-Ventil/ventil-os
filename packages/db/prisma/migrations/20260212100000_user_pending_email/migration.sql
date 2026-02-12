ALTER TABLE "User"
  ADD COLUMN "pendingEmail" TEXT;

CREATE UNIQUE INDEX "User_pendingEmail_key" ON "User"("pendingEmail");
