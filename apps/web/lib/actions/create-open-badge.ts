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

  // 1) Handle image upload / validation
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

  // Inject image and parse all fields in a single step
  formData.set('imageUrl', imageResult.url);
  const { success, data, error } = openBadgeCreateFormSchema.safeParse(formData);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values: previousState.values
    };
  }

  try {
    await createOpenBadgeRecord({
      ...data,
      creatorId: session.user.id
    });

    return {
      success: true,
      valid: true,
      values: data,
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
      values: data ?? previousState.values
    };
  }
}
