'use server';

import { getTranslations } from 'next-intl/server';
import { openBadgeCreateFormSchema, type OpenBadgeCreateFormInput } from '@repo/application/forms';
import {
  canManageBadgesUser,
  createOpenBadge as createOpenBadgeRecord,
  validateAndStoreImage,
  MAX_IMAGE_MB
} from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

const parseLevels = (formData: FormData): OpenBadgeCreateFormInput['levels'] => {
  const byIndex = new Map<number, { title?: string; description?: string }>();

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('levels[')) continue;
    const match = key.match(/levels\[(\d+)\]\.(title|description)/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2] as 'title' | 'description';
    const entry = byIndex.get(index) ?? {};

    entry[field] = value.toString();
    byIndex.set(index, entry);
  }

  return [...byIndex.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, { title = '', description = '' }]) => ({ title, description }))
    .filter((lvl) => lvl.title || lvl.description);
};

const buildValues = async (
  formData: FormData,
  previousValues: OpenBadgeCreateFormInput,
  t: (...args: any[]) => string
): Promise<OpenBadgeCreateFormInput | { error: string; fieldErrors: Record<string, string[]> }> => {
  const levels = parseLevels(formData);

  const file = formData.get('imageFile');
  const imageResult = await validateAndStoreImage(file as File | null, t, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) return imageResult;

  return {
    name: formData.get('name')?.toString() ?? previousValues.name,
    description: formData.get('description')?.toString() ?? previousValues.description,
    imageUrl: imageResult.url,
    levels,
    deliveryEnabled: formData.get('deliveryEnabled') === 'on',
    deliveryLevel: formData.get('deliveryLevel')?.toString() ?? previousValues.deliveryLevel,
    activationEnabled: formData.get('activationEnabled') === 'on'
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
