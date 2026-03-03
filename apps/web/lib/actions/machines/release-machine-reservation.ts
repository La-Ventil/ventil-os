'use server';

import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { releaseReservation } from '@repo/application/machines/usecases';
import { isMachineReservationError } from '@repo/domain/machine/machine-reservation-errors';
import { getServerSession } from '../../auth';

export type ReservationActionResult = {
  success: boolean;
  message: string;
};

export async function releaseMachineReservationAction(reservationId: string): Promise<ReservationActionResult> {
  const t = await getTranslations();
  const session = await getServerSession();

  if (!session?.user?.id) {
    return { success: false, message: t('machineReservation.unauthorized') };
  }

  try {
    await releaseReservation(reservationId, session.user);
    revalidatePath('/hub/fab-lab', 'layout');
    return { success: true, message: t('pages.hub.fabLab.reservations.success.release') };
  } catch (error) {
    if (isMachineReservationError(error)) {
      return { success: false, message: t(error.code) };
    }

    console.error(error);
    return { success: false, message: t('pages.hub.fabLab.reservations.error.release') };
  }
}
