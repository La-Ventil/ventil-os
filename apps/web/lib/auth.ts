import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from 'next-auth/react';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { redirect } from 'next/navigation';
import { signIn as signInUser, viewUserProfile } from '@repo/application/users/usecases';
import { prismaClient } from '@repo/db';
import type { UserProfile } from '@repo/view-models/user-profile';

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
      authorize: authorize()
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.globalAdmin = (user as UserProfile).globalAdmin;
        token.pedagogicalAdmin = (user as UserProfile).pedagogicalAdmin;
        token.image = (user as UserProfile).image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.globalAdmin = token.globalAdmin;
        session.user.pedagogicalAdmin = token.pedagogicalAdmin;
        session.user.image = (token.image as string | null | undefined) ?? session.user.image ?? null;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

function authorize() {
  return async (
    credentials: Partial<Record<'email' | 'password', unknown>> | undefined
  ): Promise<UserProfile | null> => {
    if (!credentials) {
      throw new Error('Missing credentials');
    }

    if (typeof credentials.email !== 'string') {
      throw new Error('"email" is required in credentials');
    }

    if (typeof credentials.password !== 'string') {
      throw new Error('"password" is required in credentials');
    }
    return signInUser(credentials.email, credentials.password);
  };
}

// Use it in server contexts
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
