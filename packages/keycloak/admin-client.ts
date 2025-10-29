import KcAdminClient from "@keycloak/keycloak-admin-client";

const KC_BASE_URL = process.env.KEYCLOAK_BASE_URL!;  // "http://localhost:8080"
const KC_REALM    = process.env.KEYCLOAK_REALM!;     // "ventilos-dev"
const KC_ADMIN_USER = process.env.KEYCLOAK_ADMIN_USER!;
const KC_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD!;

export async function getKcAdminClient(): Promise<KcAdminClient> {
console.log(KC_BASE_URL);
console.log(KC_REALM);
    const client = new KcAdminClient({ baseUrl: KC_BASE_URL, realmName: 'master' });
    console.log(KC_ADMIN_USER);
    console.log(KC_ADMIN_PASSWORD);
    await client.auth({ grantType: "password", clientId: "admin-cli", username: KC_ADMIN_USER, password: KC_ADMIN_PASSWORD });

    return client;
}