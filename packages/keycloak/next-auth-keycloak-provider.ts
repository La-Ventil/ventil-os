import KeycloakProvider from "next-auth/providers/keycloak"

export const keycloakProvider = KeycloakProvider({
    clientId: process.env.KEYCLOAK_ID!,
    clientSecret: process.env.KEYCLOAK_SECRET!,
    issuer: new URL(`/realms/${process.env.KEYCLOAK_REALM}`, process.env.KEYCLOAK_BASE_URL).toString(),
})
