'use server';

import { getTranslations } from 'next-intl/server';
import {
  openBadgeCreateFormSchema,
  openBadgeCreateFormDataSchema,
  type OpenBadgeCreateFormInput
} from '@repo/application/forms';
import {
  canManageBadgesUser,
  createOpenBadge as createOpenBadgeRecord,
  validateAndStoreImage,
  MAX_IMAGE_MB
} from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

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

  // 1) Parse form data (all fields except file)
  const parsedForm = openBadgeCreateFormDataSchema.parse(formData);
  const levels = (parsedForm.levels ?? []).filter((level) => level.title || level.description);

  // 2) Handle image upload / validation
  const file = formData.get('imageFile');
  const imageResult = await validateAndStoreImage(file as File | null, t, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) {
    return {
      success: false,
      valid: false,
      message: imageResult.error,
      fieldErrors: imageResult.fieldErrors,
      values: previousState.values
    };
  }

  const values: OpenBadgeCreateFormInput = {
    name: parsedForm.name ?? previousState.values.name,
    description: parsedForm.description ?? previousState.values.description,
    imageUrl: imageResult.url,
    levels: (parsedForm.levels ?? []).filter((level) => level.title || level.description),
    deliveryEnabled: parsedForm.deliveryEnabled ?? false,
    deliveryLevel: parsedForm.deliveryLevel ?? previousState.values.deliveryLevel,
    activationEnabled: parsedForm.activationEnabled ?? false
  };

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
