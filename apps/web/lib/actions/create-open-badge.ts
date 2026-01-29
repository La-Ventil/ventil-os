'use server';

import { getTranslations } from 'next-intl/server';
import { openBadgeCreateFormSchema, type OpenBadgeCreateFormInput } from '@repo/application/forms';
import { canManageBadgesUser, createOpenBadge as createOpenBadgeRecord } from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

const buildValues = (
  formData: FormData,
  previousValues: OpenBadgeCreateFormInput
): OpenBadgeCreateFormInput => ({
  name: formData.get('name')?.toString() ?? previousValues.name,
  description: formData.get('description')?.toString() ?? previousValues.description,
  imageUrl: formData.get('imageUrl')?.toString() ?? previousValues.imageUrl,
  levelTitle: formData.get('levelTitle')?.toString() ?? previousValues.levelTitle,
  levelDescription:
    formData.get('levelDescription')?.toString() ?? previousValues.levelDescription,
  deliveryEnabled: formData.get('deliveryEnabled') === 'on',
  deliveryLevel:
    formData.get('deliveryLevel')?.toString() ?? previousValues.deliveryLevel,
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
      message: t('openBadge.create.unauthorized', {
        defaultMessage: "Vous n'êtes pas autorisé à créer un open badge."
      }),
      isValid: false,
      fieldErrors: {},
      values: previousState.values
    };
  }
  const values = buildValues(formData, previousState.values);
  const { success, data, error } = openBadgeCreateFormSchema.safeParse(formData);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      message: fieldErrorsToSingleMessage(fieldErrors),
      isValid: false,
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
      values,
      message: t('openBadge.create.success', {
        defaultMessage: "L'open badge a bien été enregistré."
      }),
      isValid: true,
      fieldErrors: {}
    };
  } catch (err) {
    console.error(err);
    return {
      message: t('openBadge.create.error', {
        defaultMessage: "Impossible d'enregistrer l'open badge."
      }),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
