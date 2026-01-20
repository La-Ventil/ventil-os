import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from 'next-auth/react';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { type PrismaClient, Prisma } from '@prisma/client';
import { prismaClient, userRepository } from '@repo/db';
import type { UserProfile } from '@repo/domain/user-profile';
import { verifySecret } from './security';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prismaClient),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@email.com' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      authorize: authorize(prismaClient)
    })
  ],
  secret: process.env.NEXTAUTH_SECRET
};

function authorize(prisma: PrismaClient) {
  return async (
    credentials: Partial<Record<'email' | 'password', unknown>> | undefined,
    req
  ): Promise<UserProfile | null> => {
    console.log('credentials', credentials);
    if (!credentials) {
      throw new Error('Missing credentials');
    }

    if (typeof credentials.email !== 'string') {
      throw new Error('"email" is required in credentials');
    }

    if (typeof credentials.password !== 'string') {
      throw new Error('"password" is required in credentials');
    }
    const maybeUser = await prisma.user.findFirst({
      where: { email: credentials.email },
      select: {
        id: true,
        email: true,
        password: true,
        salt: true,
        iterations: true,
        profil: true,
        pseudo: true,
        niveauScolaire: true,
        adminPedagogique: true,
        adminGlobal: true,
        nom: true,
        prenom: true
      }
    });
    if (!maybeUser?.password) return null;
    // verify the input password with stored hash
    const isValid = await verifySecret(credentials.password, maybeUser.password, maybeUser.salt, maybeUser.iterations);

    if (!isValid) return null;
    console.log('maybeUser', maybeUser);
    return {
      id: maybeUser.id,
      email: maybeUser.email,
      lastName: maybeUser.nom,
      firstName: maybeUser.prenom,
      profile: maybeUser.profil,
      username: maybeUser.pseudo,
      educationLevel: maybeUser.niveauScolaire,
      isAdminGlobal: maybeUser.adminGlobal,
      isAdminPedagogical: maybeUser.adminPedagogique
    };
  };
}

// Use it in server contexts
export async function getServerSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  console.log('getServerSession', await getNextAuthServerSession(...args, authOptions));
  return getNextAuthServerSession(...args, authOptions);
}

export async function getUserProfileFromSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  const session = await getServerSession();
  console.log('session', session);
  return userRepository.getUserProfileByEmail(session.user.email);
}

export function signInAndRedirect(router: AppRouterInstance) {
  return async (email: string, password: string): Promise<void> => {
    await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    router.push('/hub/profile');
  };
}
