'use server';

import { getTranslations } from 'next-intl/server';
import {
  openBadgeUpdateRequestSchema,
  type OpenBadgeUpdateRequest,
  type OpenBadgeCreateData
} from '@repo/application/forms';
import { canManageBadgesUser, updateOpenBadge as updateOpenBadgeRecord, getOpenBadgeById } from '@repo/application';
import { validateAndStoreImage } from '@repo/application/server/uploads';
import { MAX_IMAGE_MB } from '@repo/application/uploads-constants';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

export async function updateOpenBadge(
  previousState: FormState<OpenBadgeUpdateRequest>,
  formData: FormData
): Promise<FormState<OpenBadgeUpdateRequest>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const canManageBadges = canManageBadgesUser(session?.user);

  if (!session || !canManageBadges) {
    return {
      success: false,
      valid: true,
      message: t('openBadge.update.unauthorized'),
      fieldErrors: {},
      values: previousState.values
    };
  }

  const parseResult = openBadgeUpdateRequestSchema.safeParse(formData);
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

  const request = parseResult.data as OpenBadgeUpdateRequest;
  const responseValues: OpenBadgeUpdateRequest = { ...request, imageFile: undefined };

  const current = await getOpenBadgeById(request.id);
  if (!current) {
    const msg = t('openBadge.update.notFound');
    return {
      success: false,
      valid: true,
      message: msg,
      fieldErrors: {},
      values: responseValues
    };
  }

  let imageUrl = current.coverImage ?? null;
  if (request.imageFile) {
    const imageResult = await validateAndStoreImage(request.imageFile ?? null, { maxMb: MAX_IMAGE_MB });
    if ('error' in imageResult) {
      const fieldKey = imageResult.field ?? 'imageUrl';
      const msg = t(`validation.${imageResult.error}`, imageResult.params);
      return {
        success: false,
        valid: false,
        message: msg,
        fieldErrors: { [fieldKey]: [msg] },
        values: responseValues
      };
    }
    imageUrl = imageResult.url;
  }

  const values: OpenBadgeCreateData = {
    name: request.name,
    description: request.description,
    imageUrl: imageUrl ?? '',
    levels: (request.levels ?? []).filter((level) => level.title || level.description),
    deliveryEnabled: request.deliveryEnabled ?? false,
    deliveryLevel: request.deliveryLevel ?? '',
    activationEnabled: request.activationEnabled ?? false
  };

  try {
    await updateOpenBadgeRecord({
      id: request.id,
      name: values.name,
      description: values.description,
      imageUrl: imageUrl ?? undefined,
      levels: values.levels,
      activationEnabled: values.activationEnabled
    });

    return {
      success: true,
      valid: true,
      values: responseValues,
      message: t('openBadge.update.success'),
      fieldErrors: {}
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      valid: true,
      message: t('openBadge.update.error'),
      fieldErrors: {},
      values: responseValues
    };
  }
}
