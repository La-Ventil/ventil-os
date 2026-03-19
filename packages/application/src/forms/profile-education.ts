import { z } from 'zod';
import { zfd } from 'zod-form-data';
import {
  EducationLevel,
  parseEducationLevel,
  type EducationLevel as EducationLevelValue
} from '@repo/domain/user/education-level';
import { UserRole, requiresEducationLevel, type UserRole as UserRoleValue } from '@repo/domain/user/user-role';

export type ResolvedEducationLevel = EducationLevelValue | '';

export class InvalidEducationLevelError extends Error {
  constructor(value: string) {
    super(`Invalid education level: ${value}`);
    this.name = 'InvalidEducationLevelError';
  }
}

export const resolveUserRole = (value?: string, fallback: UserRoleValue = UserRole.Member): UserRoleValue => {
  return Object.values(UserRole).includes(value as UserRoleValue) ? (value as UserRoleValue) : fallback;
};

const userRoleValues = Object.values(UserRole) as [UserRoleValue, ...UserRoleValue[]];

export const userRoleInputSchema = (message: string) =>
  zfd.text(
    z
      .string()
      .refine((value): value is UserRoleValue => userRoleValues.includes(value as UserRoleValue), { message })
      .transform((value) => value as UserRoleValue)
  );

export const normalizeEducationLevelInput = (
  educationLevel?: string | null
): EducationLevelValue | null | undefined => {
  if (educationLevel === undefined) {
    return undefined;
  }

  if (educationLevel === null || educationLevel === '') {
    return null;
  }

  const parsedEducationLevel = parseEducationLevel(educationLevel);
  if (!parsedEducationLevel) {
    throw new InvalidEducationLevelError(educationLevel);
  }

  return parsedEducationLevel;
};

export const educationLevelInputSchema = zfd.text(
  z
    .string()
    .optional()
    .transform((value, ctx): EducationLevelValue | '' | undefined => {
      if (value === undefined || value === '') {
        return '';
      }

      const parsedEducationLevel = parseEducationLevel(value);
      if (!parsedEducationLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.educationLevel.invalid'
        });
        return z.NEVER;
      }

      return parsedEducationLevel;
    })
);

export const resolveEducationLevelForRole = (
  role: UserRoleValue,
  educationLevel?: string | null,
  requiredFallback: EducationLevelValue = EducationLevel.Premiere
): ResolvedEducationLevel => {
  const parsedEducationLevel = parseEducationLevel(educationLevel);

  if (requiresEducationLevel(role)) {
    return parsedEducationLevel ?? requiredFallback;
  }

  return parsedEducationLevel ?? '';
};
