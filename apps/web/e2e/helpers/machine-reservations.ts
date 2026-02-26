import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, type Locator, type Page } from '@playwright/test';
import { openMachineReservationModalFromSchedule } from './fab-lab';
import { resolveE2EDatabaseTarget } from './e2e-db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRootDir = path.resolve(__dirname, '../../../..');

export async function createReservationFromSchedule(page: Page, machineName: RegExp = /Bambu Lab X1C/i): Promise<string> {
  const machineId = await openMachineReservationModalFromSchedule(page, machineName);

  const reservationDialog = page.getByRole('dialog', { name: machineName });
  await expect(reservationDialog).toBeVisible();
  await reservationDialog.getByRole('button', { name: /réserver|reserve/i }).click();

  await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`), { timeout: 15_000 });
  await expect(page.getByRole('dialog', { name: machineName })).toBeVisible();

  return machineId;
}

export async function openMyReservationsTab(page: Page): Promise<void> {
  await page.goto('/hub/fab-lab');
  await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();
}

export const getReservationCard = (page: Page, machineName: RegExp = /Bambu Lab X1C/i): Locator =>
  page.locator('.MuiCard-root[class*="machine-reservation-list-card"]').filter({ hasText: machineName }).first();

type ReservationTimingPreset = 'upcoming' | 'active';

const quoteIdentifier = (value: string): string => `"${value.replace(/"/g, '""')}"`;

function setLatestReservationTiming(
  args: {
    creatorEmail?: string;
    dbSlot?: string;
  },
  preset: ReservationTimingPreset
): void {
  const target = resolveE2EDatabaseTarget(args.dbSlot);
  const schema = quoteIdentifier(target.schema);
  const nowWindowSql =
    preset === 'active'
      ? `"startsAt" = NOW() - INTERVAL '5 minutes',
         "endsAt" = NOW() + INTERVAL '10 minutes'`
      : `"startsAt" = NOW() + INTERVAL '30 minutes',
         "endsAt" = NOW() + INTERVAL '45 minutes'`;

  const creatorFilter = args.creatorEmail
    ? `JOIN ${schema}."User" u ON u."id" = latest."creatorId"
  WHERE u."email" = '${args.creatorEmail.replace(/'/g, "''")}'
    AND latest."status" = 'confirmed'`
    : `WHERE latest."status" = 'confirmed'`;
  const creatorErrorDetail = args.creatorEmail ? ` for creator email ${args.creatorEmail}` : '';

  const sql = `
DO $$
DECLARE reservation_id text;
BEGIN
  SELECT latest."id" INTO reservation_id
  FROM ${schema}."MachineReservation" latest
  ${creatorFilter}
  ORDER BY latest."createdAt" DESC
  LIMIT 1;

  IF reservation_id IS NULL THEN
    RAISE EXCEPTION 'No confirmed reservation found%','${creatorErrorDetail.replace(/'/g, "''")}';
  END IF;

  UPDATE ${schema}."MachineReservation"
  SET ${nowWindowSql}
  WHERE "id" = reservation_id;
END $$;
`;

  const postgresUrl = new URL(target.url);
  postgresUrl.searchParams.delete('schema');

  execSync(`psql \"${postgresUrl.toString()}\" -v ON_ERROR_STOP=1`, {
    cwd: repoRootDir,
    env: {
      ...process.env
    },
    input: sql,
    stdio: ['pipe', 'inherit', 'inherit']
  });
}

export function setLatestReservationActive(args: {
  creatorEmail?: string;
  dbSlot?: string;
}): Promise<void> {
  setLatestReservationTiming(args, 'active');
  return Promise.resolve();
}

export function setLatestReservationUpcoming(args: { creatorEmail?: string; dbSlot?: string }): Promise<void> {
  setLatestReservationTiming(args, 'upcoming');
  return Promise.resolve();
}
