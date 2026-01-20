'use client';

import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import type { OpenBadge } from '@repo/domain/open-badge';
import OpenBadgeCard from '@repo/ui/open-badge-card';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import OpenBadgeDetailsModal from './open-badge-details-modal';

const badgeLevels = [
  {
    level: 1,
    title: 'Niveau découverte',
    body: "Découvrez les bases de l'outil et les règles de sécurité essentielles."
  },
  {
    level: 2,
    title: 'Niveau intermédiaire',
    body: 'Rendez-vous autonome sur les usages courants et les bons réglages.'
  },
  {
    level: 3,
    title: 'Niveau avancé',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }
];

const badges: OpenBadge[] = [
  {
    id: 'badge-1',
    type: 'Type de badge',
    title: 'Nom du badge',
    description:
      "Open badge permettant de se former à l'utilisation de la perceuse à colonne disponible dans le fab lab.",
    levels: badgeLevels,
    activeLevel: 2
  },
  {
    id: 'badge-2',
    type: 'Type de badge',
    title: 'Nom du badge',
    description:
      "Open badge permettant de se former à l'utilisation de la perceuse à colonne disponible dans le fab lab.",
    levels: badgeLevels,
    activeLevel: 1
  }
];

export default function Page() {
  const [selectedOpenBadge, setSelectedOpenBadge] = useState<OpenBadge | null>(null);

  return (
    <>
      <SectionTitle icon={<OpenBadgeIcon color="secondary" />}>Open Badge</SectionTitle>
      <Section>
          <SectionSubtitle>Information</SectionSubtitle>
          <Typography variant="body1">Retrouvez les Open badges disponibles et obtenus ci-dessous.</Typography>
      </Section>

      <Tabs value={0} variant="fullWidth" aria-label="Filtrer les open badges">
        <Tab label="Tous les open badges" />
        <Tab label="Mes open badges" />
      </Tabs>

      <Section>
          {badges.map((badge) => (
            <OpenBadgeCard key={badge.id} badge={badge} onClick={() => setSelectedOpenBadge(badge)} />
          ))}
      </Section>

      <OpenBadgeDetailsModal
        openBadge={selectedOpenBadge}
        open={Boolean(selectedOpenBadge)}
        onClose={() => setSelectedOpenBadge(null)}
      />
    </>
  );
}
