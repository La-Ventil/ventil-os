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
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const formDataSchema = zfd.formData({
  name: zfd.text(),
  description: zfd.text(),
  deliveryEnabled: zfd.checkbox(),
  deliveryLevel: zfd.text(z.string().optional()),
  activationEnabled: zfd.checkbox(),
  'levels.title': zfd.repeatableOfType(zfd.text()),
  'levels.description': zfd.repeatableOfType(zfd.text())
});

const buildValues = async (
  formData: FormData,
  previousValues: OpenBadgeCreateFormInput,
  t: (...args: any[]) => string
): Promise<OpenBadgeCreateFormInput | { error: string; fieldErrors: Record<string, string[]> }> => {
  const file = formData.get('imageFile');
  const imageResult = await validateAndStoreImage(file as File | null, t, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) return imageResult;

  const parsedForm = formDataSchema.parse(formData);
  const titles = parsedForm['levels.title'] ?? [];
  const descriptions = parsedForm['levels.description'] ?? [];
  const levels = titles
    .map((title, idx) => ({ title, description: descriptions[idx] ?? '' }))
    .filter((level) => level.title || level.description);

  return {
    name: parsedForm.name ?? previousValues.name,
    description: parsedForm.description ?? previousValues.description,
    imageUrl: imageResult.url,
    levels,
    deliveryEnabled: parsedForm.deliveryEnabled ?? false,
    deliveryLevel: parsedForm.deliveryLevel ?? previousValues.deliveryLevel,
    activationEnabled: parsedForm.activationEnabled ?? false
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
