import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession as getNextAuthServerSession } from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prismaClient} from "@repo/db";
import {keycloakProvider} from "@repo/keycloak/next-auth-keycloak-provider";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prismaClient),
    providers: [keycloakProvider],
    secret: process.env.NEXTAUTH_SECRET,
}

// Use it in server contexts
export function getServerSession(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getNextAuthServerSession(...args, authOptions)
}