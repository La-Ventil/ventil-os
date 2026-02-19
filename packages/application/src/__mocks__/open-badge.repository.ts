import { OpenBadgeLevel, formatOpenBadgeLevelLabel } from '@repo/domain/badge/open-badge-level';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';

const badgeLevels = [
  OpenBadgeLevel.from(
    1,
    'Niveau decouverte',
    "Decouvrez les bases de l'outil et les regles de securite essentielles."
  ),
  OpenBadgeLevel.from(
    2,
    'Niveau intermediaire',
    'Rendez-vous autonome sur les usages courants et les bons reglages.'
  ),
  OpenBadgeLevel.from(
    3,
    'Niveau avance',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  )
].map((level) => ({
  ...level,
  label: formatOpenBadgeLevelLabel(level)
}));

const badges: OpenBadgeViewModel[] = [
  {
    id: 'badge-1',
    type: 'Type de badge',
    name: 'Nom du badge',
    description:
      "Open badge permettant de se former a l'utilisation de la perceuse a colonne disponible dans le fab lab.",
    levels: badgeLevels,
    activeLevel: 2
  },
  {
    id: 'badge-2',
    type: 'Type de badge',
    name: 'Nom du badge',
    description:
      "Open badge permettant de se former a l'utilisation de la perceuse a colonne disponible dans le fab lab.",
    levels: badgeLevels,
    activeLevel: 1
  }
];

export class OpenBadgeRepositoryMock {
  async listOpenBadges(): Promise<OpenBadgeViewModel[]> {
    return badges;
  }

  async listOpenBadgesForUser(userId: string): Promise<OpenBadgeViewModel[]> {
    void userId;
    return badges.filter((badge) => badge.activeLevel > 0);
  }

  async getOpenBadgeById(id: string): Promise<OpenBadgeViewModel | null> {
    return badges.find((badge) => badge.id === id) ?? null;
  }
}
