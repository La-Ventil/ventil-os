import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import OpenBadgeCard, { OpenBadgeCardData } from '@repo/ui/open-badge-card';
import SectionTitle from '@repo/ui/section-title';
import styles from './page.module.css';

const badges: OpenBadgeCardData[] = [
  {
    id: 'badge-1',
    type: 'Type de badge',
    title: 'Nom du badge',
    description:
      "Open badge permettant de se former à l'utilisation de la perceuse à colonne disponible dans le fab lab.",
    levels: [1, 2, 3],
    activeLevel: 2
  },
  {
    id: 'badge-2',
    type: 'Type de badge',
    title: 'Nom du badge',
    description:
      "Open badge permettant de se former à l'utilisation de la perceuse à colonne disponible dans le fab lab.",
    levels: [1, 2, 3],
    activeLevel: 1
  }
];

export default function Page() {
  return (
    <Stack spacing={2.5}>        
      <SectionTitle icon={<OpenBadgeIcon />}>Open Badge</SectionTitle>
      <Typography variant="h3">Information</Typography>
      <Typography variant="body1">Retrouvez les Open badges disponibles et obtenus ci-dessous.</Typography>

      <Tabs value={0} variant="fullWidth" aria-label="Filtrer les open badges">
        <Tab label="Tous les open badges" />
        <Tab label="Mes open badges" />
      </Tabs>

      <Stack spacing={2}>
        {badges.map((badge) => (
          <OpenBadgeCard key={badge.id} badge={badge} />
        ))}
      </Stack>
    </Stack>
  );
}
