'use server';

import { getTranslations } from 'next-intl/server';
import { openBadgeCreateFormSchema, type OpenBadgeCreateFormInput } from '@repo/application/forms';
import { canManageBadgesUser, createOpenBadge as createOpenBadgeRecord } from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

const buildValues = async (
  formData: FormData,
  previousValues: OpenBadgeCreateFormInput,
  t: (key: string, vars?: Record<string, unknown>) => string
): Promise<OpenBadgeCreateFormInput | { error: string; fieldErrors: Record<string, string[]> }> => {
  const levels = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('levels['))
    .reduce<OpenBadgeCreateFormInput['levels']>((acc, [key, value]) => {
      const match = key.match(/levels\[(\d+)\]\.(title|description)/);
      if (!match) return acc;
      const idx = Number(match[1]);
      acc[idx] = acc[idx] || { title: '', description: '' };
      acc[idx][match[2] as 'title' | 'description'] = value.toString();
      return acc;
    }, [])
    .filter((lvl) => lvl && (lvl.title || lvl.description));

  const file = formData.get('imageFile');
  const url = formData.get('imageUrl')?.toString() ?? previousValues.imageUrl;

  const imageResult = await pickImageSource(file, url, t);
  if ('error' in imageResult) return imageResult;

  return {
    name: formData.get('name')?.toString() ?? previousValues.name,
    description: formData.get('description')?.toString() ?? previousValues.description,
    imageUrl: imageResult.imageUrl,
    levels,
    deliveryEnabled: formData.get('deliveryEnabled') === 'on',
    deliveryLevel: formData.get('deliveryLevel')?.toString() ?? previousValues.deliveryLevel,
    activationEnabled: formData.get('activationEnabled') === 'on'
  };
};

const pickImageSource = async (
  file: FormDataEntryValue | null,
  url: string,
  t: (key: string, vars?: Record<string, unknown>) => string
): Promise<{ imageUrl: string } | { error: string; fieldErrors: Record<string, string[]> }> => {
  const maxBytes = 5 * 1024 * 1024;
  if (file instanceof File && file.size > 0) {
    if (file.size > maxBytes) {
      return {
        error: t('validation.imageTooLarge', { max: '5MB' }),
        fieldErrors: { imageUrl: [t('validation.imageTooLarge', { max: '5MB' })] }
      };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mime = file.type || 'image/png';
    return { imageUrl: `data:${mime};base64,${base64}` };
  }

  if (url) return { imageUrl: url };

  return {
    error: t('validation.openBadge.imageRequired'),
    fieldErrors: { imageUrl: [t('validation.openBadge.imageRequired')] }
  };
};

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
  const valuesOrError = await buildValues(formData, previousState.values, t);

  if ('error' in valuesOrError) {
    return {
      success: false,
      valid: false,
      message: valuesOrError.error,
      fieldErrors: valuesOrError.fieldErrors,
      values: previousState.values
    };
  }

  const values = valuesOrError;
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
