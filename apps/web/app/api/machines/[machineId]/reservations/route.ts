import { getTranslations, getTimeZone } from 'next-intl/server';
import { resolveDayKeyFromString } from '@repo/application';
import { viewMachineReservationsForDayKey } from '@repo/application/machines/usecases';
import { getServerSession } from '../../../../../lib/auth';
import { traceServerOperation } from '../../../../../lib/observability/server-tracing';

type RouteContext = {
  params: Promise<{ machineId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  return traceServerOperation(
    'fab_lab.machine_reservations_day_route',
    { 'http.route': '/api/machines/[machineId]/reservations' },
    async () => {
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

      const reservations = await traceServerOperation(
        'fab_lab.machine_reservations_day_query',
        {
          'app.machine.id': machineId,
          'app.machine.day': dayKey,
          'app.user.authenticated': true
        },
        () => viewMachineReservationsForDayKey(machineId, dayKey, timeZone)
      );

      return Response.json({ reservations });
    }
  );
}
