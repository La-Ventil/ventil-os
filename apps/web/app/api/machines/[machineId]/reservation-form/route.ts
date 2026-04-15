import { getTranslations } from 'next-intl/server';
import { browseUsersForReservation } from '@repo/application/users/usecases';
import { getServerSession } from '../../../../../lib/auth';

type RouteContext = {
  params: Promise<{ machineId: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const [session, t] = await Promise.all([getServerSession(), getTranslations('common')]);

  if (!session?.user) {
    return Response.json({ message: t('errors.unauthorized') }, { status: 401 });
  }

  await context.params;
  const participantOptions = await browseUsersForReservation();

  return Response.json({ participantOptions });
}
