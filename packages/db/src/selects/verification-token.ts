import type { Prisma } from '@prisma/client';

export const verificationTokenSelect = {
  identifier: true,
  token: true,
  expires: true
} as const;

export type VerificationTokenPayload = Prisma.VerificationTokenGetPayload<{
  select: typeof verificationTokenSelect;
}>;
