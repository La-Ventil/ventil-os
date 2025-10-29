import {getKcAdminClient} from "./admin-client";

export class KeycloakClient {
    async creerUtilisateur(input: {
        email: string; username: string; firstName: string; lastName: string;
        attributs?: Record<string, string[]>;
        emailVerified?: boolean;
    }): Promise<{ id: string }> {
        const client = await getKcAdminClient();
        const res = await client.users.create({
            realm: process.env.KEYCLOAK_REALM,
            username: input.username,
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            enabled: true,
            emailVerified: input.emailVerified ?? false,
            attributes: input.attributs ?? {},
        });
        return { id: res.id };
    }

    async definirMotDePasse(userId: string, password: string, temporaire = false): Promise<void> {
        const client = await getKcAdminClient();
        await client.users.resetPassword({
            realm: process.env.KEYCLOAK_REALM,
            id: userId,
            credential: { type: "password", value: password, temporary: temporaire },
        });
    }

    async assignerRolesRealm(userId: string, roleNames: string[]): Promise<void> {
        if (!roleNames.length) return;
        const client = await getKcAdminClient();
        const roles = await Promise.all(roleNames.map((name) => client.roles.findOneByName({
            realm: process.env.KEYCLOAK_REALM,
            name
        })));
        await client.users.addRealmRoleMappings({
            realm: process.env.KEYCLOAK_REALM,
            id: userId,
            roles: roles.filter(Boolean).map((r) => ({ id: r!.id!, name: r!.name! })),
        });
    }

    async majAttributs(userId: string, attributs: Record<string, string[]>): Promise<void> {
        const client = await getKcAdminClient();
        await client.users.update({ realm: process.env.KEYCLOAK_REALM, id: userId }, { attributes: attributs });
    }

    async supprimerUtilisateur(userId: string): Promise<void> {
        const client = await getKcAdminClient();
        await client.users.del({ realm: process.env.KEYCLOAK_REALM, id: userId });
    }
}

export const keycloakClient = new KeycloakClient();
