import { describe, expect, it } from 'vitest';
import { EducationLevel } from '@repo/domain/user/education-level';
import { educationLevelInputSchema, normalizeEducationLevelInput } from './profile-education';

describe('profile education form helpers', () => {
  it('normalizes a valid education level code', () => {
    expect(normalizeEducationLevelInput('terminale')).toBe(EducationLevel.Terminale);
  });

  it('accepts legacy aliases while normalizing to domain code', () => {
    expect(normalizeEducationLevelInput('Terminale')).toBe(EducationLevel.Terminale);
    expect(normalizeEducationLevelInput('terminal')).toBe(EducationLevel.Terminale);
  });

  it('rejects invalid education levels', () => {
    expect(() => normalizeEducationLevelInput('unknown-level')).toThrow('Invalid education level');
  });

  it('schema rejects invalid education level input', () => {
    const result = educationLevelInputSchema.safeParse('unknown-level');
    expect(result.success).toBe(false);
  });
});
