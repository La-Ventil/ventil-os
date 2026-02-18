'use server';

import { getTranslations } from 'next-intl/server';
import {
  openBadgeUpdateRequestSchema,
  type OpenBadgeUpdateRequest,
  type OpenBadgeCreateData
} from '@repo/application/forms';
import { canManageBadges, updateOpenBadge as updateOpenBadgeRecord, getOpenBadgeById } from '@repo/application';
import { MAX_IMAGE_MB, validateAndStoreImage } from '@repo/application/server/uploads';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateOpenBadge(
  previousState: FormState<OpenBadgeUpdateRequest>,
  formData: FormData
): Promise<FormState<OpenBadgeUpdateRequest>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    return formError(previousState.values, { message: t('openBadge.update.unauthorized') });
  }

  const parseResult = openBadgeUpdateRequestSchema.safeParse(formData);
  if (!parseResult.success) {
    const fieldErrors = zodErrorToFieldErrors(parseResult.error, t);
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }

  const request = parseResult.data as OpenBadgeUpdateRequest;
  const responseValues: OpenBadgeUpdateRequest = { ...request, imageFile: undefined };

  const current = await getOpenBadgeById(request.id);
  if (!current) {
    const msg = t('openBadge.update.notFound');
    return formError(responseValues, { message: msg });
  }

  let imageUrl = current.coverImage ?? null;
  if (request.imageFile) {
    const imageResult = await validateAndStoreImage(request.imageFile ?? null, { maxMb: MAX_IMAGE_MB });
    if ('error' in imageResult) {
      const fieldKey = imageResult.field ?? 'imageUrl';
      const msg = t(`validation.${imageResult.error}`, imageResult.params);
      return formValidationError(responseValues, { [fieldKey]: [msg] }, msg);
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

    return formSuccess(responseValues, t('openBadge.update.success'));
  } catch (err) {
    console.error(err);
    return formError(responseValues, { message: t('openBadge.update.error') });
  }
}
