import { getTranslations } from 'next-intl/server';
import { browseUsersForReservation } from '@repo/application/users/usecases';
import { getServerSession } from '../../../../../lib/auth';
import { traceServerOperation } from '../../../../../lib/observability/server-tracing';

type RouteContext = {
  params: Promise<{ machineId: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  return traceServerOperation(
    'fab_lab.machine_reservation_form_route',
    { 'http.route': '/api/machines/[machineId]/reservation-form' },
    async () => {
      const [session, t, { machineId }] = await Promise.all([
        getServerSession(),
        getTranslations('common'),
        context.params
      ]);

      if (!session?.user) {
        return Response.json({ message: t('errors.unauthorized') }, { status: 401 });
      }

      const participantOptions = await traceServerOperation(
        'fab_lab.machine_reservation_form.participant_options',
        {
          'app.machine.id': machineId,
          'app.user.authenticated': true
        },
        () => browseUsersForReservation()
      );

      return Response.json({ participantOptions });
    }
  );
}
