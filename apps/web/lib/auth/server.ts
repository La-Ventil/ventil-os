import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { viewUserProfile } from '@repo/application/users/usecases';
import { prismaClient } from '@repo/db';
import { authOptions } from './config';

export async function getServerSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  const session = await getNextAuthServerSession(...args, authOptions);
  if (!session?.user?.id) {
    return session;
  }

  const status = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: { blocked: true }
  });

  if (status?.blocked) {
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
