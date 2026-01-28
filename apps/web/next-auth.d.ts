import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      globalAdmin?: boolean;
      pedagogicalAdmin?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    globalAdmin?: boolean;
    pedagogicalAdmin?: boolean;
  }
}

export {};
