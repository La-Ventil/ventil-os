import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { cache } from 'react';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { isUserBlocked, viewUserProfile } from '@repo/application/users/usecases';
import { authOptions } from './config';

/**
 * Memoized per request — deduplicates the `isUserBlocked` DB round-trip when
 * `getServerSession` is called multiple times in the same server render tree
 * (e.g. page + several route handlers invoked during the same navigation).
 */
const cachedIsUserBlocked = cache(isUserBlocked);

export async function getServerSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  const session = await getNextAuthServerSession(...args, authOptions);
  if (!session?.user?.id) {
    return session;
  }

  const blocked = await cachedIsUserBlocked(session.user.id);
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
