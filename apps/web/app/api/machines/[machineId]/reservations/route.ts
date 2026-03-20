import { getTranslations, getTimeZone } from 'next-intl/server';
import { resolveDayKeyFromString } from '@repo/application';
import { viewMachineReservationsForDayKey } from '@repo/application/machines/usecases';
import { getServerSession } from '../../../../../lib/auth';

type RouteContext = {
  params: Promise<{ machineId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const [{ machineId }, session, fallbackTimeZone, t] = await Promise.all([
    context.params,
    getServerSession(),
    getTimeZone(),
    getTranslations('common')
  ]);
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');
  const timeZone = searchParams.get('timeZone') ?? fallbackTimeZone;

  const dayKey = resolveDayKeyFromString(day);

  if (!dayKey) {
    return Response.json({ message: t('errors.invalid') }, { status: 400 });
  }

  if (!session?.user) {
    return Response.json({ message: t('errors.unauthorized') }, { status: 401 });
  }

  // This endpoint exists only to refresh the daily reservation schedule inside the
  // machine modal without retriggering the whole server page for the modal route.
  const reservations = await viewMachineReservationsForDayKey(machineId, dayKey, timeZone);

  return Response.json({ reservations });
}
