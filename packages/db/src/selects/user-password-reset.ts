import type { Prisma } from '@prisma/client';

export const userPasswordResetSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true
} as const;

export type UserPasswordResetPayload = Prisma.UserGetPayload<{
  select: typeof userPasswordResetSelect;
}>;
