'use server';

import { getTranslations } from 'next-intl/server';
import {
  openBadgeCreateRequestSchema,
  type OpenBadgeCreateRequest,
  type OpenBadgeCreateData
} from '@repo/application/forms';
import {
  canManageBadgesUser,
  createOpenBadge as createOpenBadgeRecord,
  validateAndStoreImage,
  MAX_IMAGE_MB
} from '@repo/application';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

export async function createOpenBadge(
  previousState: FormState<OpenBadgeCreateData>,
  formData: FormData
): Promise<FormState<OpenBadgeCreateData>> {
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
  const userId = session.user.id;

  // 1) Validate all fields including imageFile presence
  const parseResult = openBadgeCreateRequestSchema.safeParse(formData);
  if (!parseResult.success) {
    const fieldErrors = zodErrorToFieldErrors(parseResult.error, t);
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values: previousState.values
    };
  }
  const request = parseResult.data as OpenBadgeCreateRequest;

  // 2) Handle image upload / validation (file already type-checked)
  const imageResult = await validateAndStoreImage(request.imageFile as File | null, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) {
    const fieldKey = imageResult.field ?? 'imageUrl';
    const msg = t(`validation.${imageResult.error}`, imageResult.params);
    return {
      success: false,
      valid: false,
      message: msg,
      fieldErrors: { [fieldKey]: [msg] },
      values: previousState.values
    };
  }

  // 3) Build final values
  const values: OpenBadgeCreateData = {
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl: imageResult.url,
    levels: (request.levels ?? []).filter((level) => level.title || level.description),
    deliveryEnabled: request.deliveryEnabled ?? false,
    deliveryLevel: request.deliveryLevel ?? previousState.values.deliveryLevel,
    activationEnabled: request.activationEnabled ?? false
  };

  try {
    await createOpenBadgeRecord({
      ...values,
      creatorId: userId
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
      values: values ?? previousState.values
    };
  }
}
