import { describe, expect, it } from 'vitest';
import { openBadgeCreateRequestSchema } from './open-badge-create-form-input';

describe('openBadgeCreateRequestSchema', () => {
  it('uses domain validation keys for missing nested level fields', () => {
    const formData = new FormData();
    formData.set('name', 'Badge');
    formData.set('description', 'Description');
    formData.set('deliveryEnabled', 'on');
    formData.set('deliveryLevel', 'level-1');
    formData.set('activationEnabled', 'on');
    formData.set('levels[0].description', 'Description du niveau');
    formData.set('imageFile', new File(['payload'], 'badge.png', { type: 'image/png' }));

    const result = openBadgeCreateRequestSchema.safeParse(formData);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['levels', 0, 'title'],
          message: 'validation.openBadge.levelTitleRequired'
        })
      ])
    );
  });
});
