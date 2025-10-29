import BaseUserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";

export type UserRepresentations = BaseUserRepresentation & { profil: string, sous_profil: string };