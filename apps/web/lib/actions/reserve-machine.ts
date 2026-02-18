'use server';

import { getTranslations } from 'next-intl/server';
import { reserveMachine as reserveMachineUseCase, machineReservationFormSchema } from '@repo/application';
import type { MachineReservationFormInput } from '@repo/application/forms';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { revalidatePath } from 'next/cache';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { isMachineReservationError } from '@repo/domain/machine/machine-reservation-errors';

export async function reserveMachine(
  previousState: FormState<MachineReservationFormInput>,
  formData: FormData
): Promise<FormState<MachineReservationFormInput>> {
  const t = await getTranslations();
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    return formError(previousState.values, {
      message: t('pages.hub.fabLab.modal.reservationForm.unauthorized')
    });
  }

  const { success, data, error } = machineReservationFormSchema.safeParse(formData);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
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

    return formSuccess(data, t('pages.hub.fabLab.modal.reservationForm.success'));
  } catch (err) {
    if (isMachineReservationError(err)) {
      return formError(data, { message: t(err.code) });
    }

    console.error(err);
    return formError(data, { message: t('pages.hub.fabLab.modal.reservationForm.error') });
  }
}
