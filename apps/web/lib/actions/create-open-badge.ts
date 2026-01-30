'use server';

import { getTranslations } from 'next-intl/server';
import { openBadgeCreateFormSchema, type OpenBadgeCreateFormInput } from '@repo/application/forms';
import { canManageBadgesUser, createOpenBadge as createOpenBadgeRecord } from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

const buildValues = (formData: FormData, previousValues: OpenBadgeCreateFormInput): OpenBadgeCreateFormInput => ({
  name: formData.get('name')?.toString() ?? previousValues.name,
  description: formData.get('description')?.toString() ?? previousValues.description,
  imageUrl: formData.get('imageUrl')?.toString() ?? previousValues.imageUrl,
  levels: Array.from(formData.entries())
    .filter(([key]) => key.startsWith('levels['))
    .reduce<OpenBadgeCreateFormInput['levels']>((acc, [key, value]) => {
      const match = key.match(/levels\[(\d+)\]\.(title|description)/);
      if (!match) return acc;
      const idx = Number(match[1]);
      acc[idx] = acc[idx] || { title: '', description: '' };
      acc[idx][match[2] as 'title' | 'description'] = value.toString();
      return acc;
    }, [])
    .filter((lvl) => lvl && (lvl.title || lvl.description)),
  deliveryEnabled: formData.get('deliveryEnabled') === 'on',
  deliveryLevel: formData.get('deliveryLevel')?.toString() ?? previousValues.deliveryLevel,
  activationEnabled: formData.get('activationEnabled') === 'on'
});

export async function createOpenBadge(
  previousState: FormState<OpenBadgeCreateFormInput>,
  formData: FormData
): Promise<FormState<OpenBadgeCreateFormInput>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const canManageBadges = canManageBadgesUser(session?.user);

  if (!session || !canManageBadges) {
    return {
      success: false,
      valid: true,
      message: t('openBadge.create.unauthorized'),
      fieldErrors: {},
      values: previousState.values
    };
  }
  const values = buildValues(formData, previousState.values);
  const { success, data, error } = openBadgeCreateFormSchema.safeParse(values);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values
    };
  }

  try {
    const parsed: OpenBadgeCreateFormInput = data;
    await createOpenBadgeRecord({
      ...parsed,
      creatorId: session.user.id
    });

    return {
      success: true,
      valid: true,
      values,
      message: t('openBadge.create.success'),
      fieldErrors: {}
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      valid: true,
      message: t('openBadge.create.error'),
      fieldErrors: {},
      values
    };
  }
}
