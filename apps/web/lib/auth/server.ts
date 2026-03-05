import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { isUserBlocked, viewUserProfile } from '@repo/application/users/usecases';
import { authOptions } from './config';

export async function getServerSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  const session = await getNextAuthServerSession(...args, authOptions);
  if (!session?.user?.id) {
    return session;
  }

  const blocked = await isUserBlocked(session.user.id);
  if (blocked) {
    return null;
  }

  return session;
}

export async function getUserProfileFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect('/login');
  }

  const profile = await viewUserProfile(session.user.email);
  if (!profile) {
    redirect('/login');
  }

  return profile;
}
