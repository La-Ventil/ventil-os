import type { PrismaClient } from '@prisma/client';
import { UserProfile } from '@repo/domain/user-profile';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserProfileByEmail(email: string): Promise<UserProfile> {
    const maybeUser = await this.prisma.user.findFirstOrThrow({
      where: { email },
      select: {
        id: true,
        email: true,
        profil: true,
        pseudo: true,
        niveauScolaire: true,
        adminPedagogique: true,
        adminGlobal: true,
        nom: true,
        prenom: true
      }
    });

    return {
      id: maybeUser.id,
      email: maybeUser.email,
      lastName: maybeUser.nom,
      firstName: maybeUser.prenom,
      profile: maybeUser.profil,
      username: maybeUser.pseudo,
      educationLevel: maybeUser.niveauScolaire,
      isAdminGlobal: maybeUser.adminGlobal,
      isAdminPedagogical: maybeUser.adminPedagogique
    };
  }
}
