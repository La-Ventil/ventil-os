import { describe, expect, it } from 'vitest';
import { AdminAccessLevel, parseAdminUserEditFormInput, resolveAdminAccessLevel } from './admin-user-edit-form-input';

const buildFormData = (overrides?: Record<string, string>) => {
  const formData = new FormData();
  formData.set('firstName', overrides?.firstName ?? 'Alice');
  formData.set('lastName', overrides?.lastName ?? 'Martin');
  formData.set('profile', overrides?.profile ?? 'member');
  formData.set('adminAccessLevel', overrides?.adminAccessLevel ?? AdminAccessLevel.None);

  if (overrides?.educationLevel !== undefined) {
    formData.set('educationLevel', overrides.educationLevel);
  }

  return formData;
};

describe('admin user edit form input', () => {
  it('requires an education level for member profiles', () => {
    const result = parseAdminUserEditFormInput(buildFormData({ profile: 'member' }));

    expect(result.success).toBe(false);
  });

  it('accepts a student profile with an education level', () => {
    const result = parseAdminUserEditFormInput(buildFormData({ profile: 'member', educationLevel: 'bts' }));

    expect(result.success).toBe(true);
  });

  it('accepts a teacher profile without an education level', () => {
    const result = parseAdminUserEditFormInput(buildFormData({ profile: 'teacher' }));

    expect(result.success).toBe(true);
  });

  it('resolves admin access levels from admin flags', () => {
    expect(resolveAdminAccessLevel({ globalAdmin: true, pedagogicalAdmin: false })).toBe(AdminAccessLevel.Global);
    expect(resolveAdminAccessLevel({ globalAdmin: false, pedagogicalAdmin: true })).toBe(AdminAccessLevel.Pedagogical);
    expect(resolveAdminAccessLevel({ globalAdmin: false, pedagogicalAdmin: false })).toBe(AdminAccessLevel.None);
  });
});
