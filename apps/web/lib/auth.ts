import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from 'next-auth/react';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { redirect } from 'next/navigation';
import { getUserCredentialsByEmail, getUserProfileByEmail } from '@repo/application';
import { prismaClient } from '@repo/application/prisma';
import type { UserProfile } from '@repo/view-models/user-profile';
import { verifySecret } from '@repo/crypto';

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
    const maybeUser = await getUserCredentialsByEmail(credentials.email);
    if (!maybeUser?.password) return null;
    // verify the input password with stored hash
    const isValid = await verifySecret(credentials.password, maybeUser.password, maybeUser.salt, maybeUser.iterations);

    if (!isValid) return null;
    return getUserProfileByEmail(maybeUser.email);
  };
}

// Use it in server contexts
export async function getServerSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  return getNextAuthServerSession(...args, authOptions);
}

export async function getUserProfileFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect('/login');
  }

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
