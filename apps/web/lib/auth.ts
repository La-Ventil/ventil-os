import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { NextAuthOptions, RequestInternal } from 'next-auth';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from 'next-auth/react';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { prismaClient } from '@repo/db';
import { getUserCredentialsByEmail, getUserProfileByEmail } from '@repo/application';
import type { UserProfile } from '@repo/view-models/user-profile';
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
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

function authorize(prisma: PrismaClient) {
  return async (
    credentials: Partial<Record<'email' | 'password', unknown>> | undefined,
    _req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>
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
    const maybeUser = await getUserCredentialsByEmail(credentials.email);
    if (!maybeUser?.password) return null;
    // verify the input password with stored hash
    const isValid = await verifySecret(credentials.password, maybeUser.password, maybeUser.salt, maybeUser.iterations);

    if (!isValid) return null;
    console.log('maybeUser', maybeUser);
    return {
      id: maybeUser.id,
      email: maybeUser.email,
      lastName: maybeUser.lastName,
      firstName: maybeUser.firstName,
      profile: maybeUser.profile,
      username: maybeUser.username,
      educationLevel: maybeUser.educationLevel,
      globalAdmin: maybeUser.globalAdmin,
      pedagogicalAdmin: maybeUser.pedagogicalAdmin
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
  if (!session?.user?.email) {
    redirect('/login');
  }
  console.log('session', session);
  const profile = await getUserProfileByEmail(session.user.email);
  if (!profile) {
    redirect('/login');
  }
  return profile;
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
