import {ProfilUtilisateur} from "@repo/domain/profil-utilisateur";
import type {PrismaClient} from "@prisma/client";

export class UtilisateurRepository {
    constructor(private prisma: PrismaClient) {
    }

    async getProfilUtilisateurByEmail(email: string): Promise<ProfilUtilisateur> {
        const maybeUser = await this.prisma.user.findFirstOrThrow({
            where: { email: email },
            select: { id: true, email: true, profil: true, pseudo: true, niveauScolaire: true, adminPedagogique: true, adminGlobal: true, nom: true, prenom: true },
        });

        return {
            id: maybeUser.id,
            email: maybeUser.email,
            nom: maybeUser.nom,
            prenom: maybeUser.prenom,
            profil: maybeUser.profil,
            pseudo: maybeUser.pseudo,
            niveauScolaire: maybeUser.niveauScolaire,
            adminGlobal: maybeUser.adminGlobal,
            adminPedagogique: maybeUser.adminPedagogique,
        };
    }
}
