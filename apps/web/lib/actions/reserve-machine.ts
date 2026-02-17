'use server';

import { getTranslations } from 'next-intl/server';
import { reserveMachine as reserveMachineUseCase, machineReservationFormSchema } from '@repo/application';
import type { MachineReservationFormInput } from '@repo/application/forms';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { revalidatePath } from 'next/cache';

export async function reserveMachine(
  previousState: FormState<MachineReservationFormInput>,
  formData: FormData
): Promise<FormState<MachineReservationFormInput>> {
  const t = await getTranslations();
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    return {
      success: false,
      valid: true,
      message: t('pages.hub.fabLab.modal.reservationForm.unauthorized'),
      fieldErrors: {},
      values: previousState.values
    };
  }

  const { success, data, error } = machineReservationFormSchema.safeParse(formData);

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

  const startsAt = new Date(data.startsAt);
  const participantIds = data.participantIds ?? [];

  try {
    await reserveMachineUseCase({
      machineId: data.machineId,
      creatorId: session.user.id,
      startsAt,
      durationMinutes: data.durationMinutes,
      participantIds
    });
    revalidatePath('/hub/fab-lab');

    return {
      success: true,
      valid: true,
      message: t('pages.hub.fabLab.modal.reservationForm.success'),
      fieldErrors: {},
      values: data
    };
  } catch (err) {
    const message = (() => {
      if (!(err instanceof Error)) {
        return t('pages.hub.fabLab.modal.reservationForm.error');
      }

      if (err.message.startsWith('machineReservation.')) {
        return t(err.message);
      }

      return t('pages.hub.fabLab.modal.reservationForm.error');
    })();

    return {
      success: false,
      valid: true,
      message,
      fieldErrors: {},
      values: data
    };
  }
}
