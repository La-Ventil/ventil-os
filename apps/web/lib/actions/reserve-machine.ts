'use server';

import { getTranslations } from 'next-intl/server';
import { machineReservationFormSchema } from '@repo/application';
import { reserveMachine, updateReservation } from '@repo/application/machines/usecases';
import type { MachineReservationFormInput } from '@repo/application/forms';
import type { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '../validation';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getServerSession } from '../auth';
import { revalidatePath } from 'next/cache';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { isMachineReservationError } from '@repo/domain/machine/machine-reservation-errors';

export async function reserveMachineAction(
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
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToMessage(fieldErrors));
  }

  const startsAt = new Date(data.startsAt);
  const participantIds = data.participantIds ?? [];

  try {
    if (data.reservationId) {
      await updateReservation({
        reservationId: data.reservationId,
        startsAt,
        durationMinutes: data.durationMinutes,
        participantIds,
        currentUser: session.user
      });
    } else {
      await reserveMachine({
        machineId: data.machineId,
        creatorId: session.user.id,
        startsAt,
        durationMinutes: data.durationMinutes,
        participantIds
      });
    }
    revalidatePath('/hub/fab-lab', 'layout');

    return formSuccess(
      data,
      t(
        data.reservationId
          ? 'pages.hub.fabLab.modal.reservationForm.updateSuccess'
          : 'pages.hub.fabLab.modal.reservationForm.success'
      )
    );
  } catch (err) {
    if (isMachineReservationError(err)) {
      return formError(data, { message: t(err.code) });
    }

    console.error(err);
    return formError(data, {
      message: t(
        data.reservationId
          ? 'pages.hub.fabLab.modal.reservationForm.updateError'
          : 'pages.hub.fabLab.modal.reservationForm.error'
      )
    });
  }
}
