import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { signIn } from 'next-auth/react';

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
