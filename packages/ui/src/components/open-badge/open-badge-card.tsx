import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { OpenBadgeViewModel, OpenBadgeLevelViewModel as DomainOpenBadgeLevel } from '@repo/view-models/open-badge';
import Link from 'next/link';
import CardHeader from '../card-header';
import { OpenBadgeIcon } from '../icons/open-badge-icon';
import LevelChip from '../level-chip';
import styles from './open-badge-card.module.css';

export type OpenBadgeLevel = DomainOpenBadgeLevel;
export type OpenBadgeCardData = OpenBadgeViewModel;

export type OpenBadgeCardProps = {
  badge: OpenBadgeCardData;
  href?: string;
};

export default function OpenBadgeCard({ badge, href }: OpenBadgeCardProps) {
  const content = (
    <Card className={styles.card}>
      <CardHeader
        icon={<OpenBadgeIcon color="secondary" />}
        overline={badge.type}
        overlineClassName={styles.category}
        title={badge.name}
      />
      <CardContent className={styles.content}>
        <Box display="flex" gap={2}>
          <CardMedia className={styles.illustration} component="div">
            {badge.coverImage ? <img src={badge.coverImage} alt={badge.name} /> : 'Illustration en cours'}
          </CardMedia>
          <Stack flex={1}>
            <div className={styles.levelRow}>
              {badge.levels.map((levelEntry) => (
                <LevelChip
                  key={`${badge.id}-level-${levelEntry.level}`}
                  level={levelEntry.level}
                  isActive={levelEntry.level <= badge.activeLevel}
                  className={styles.levelChip}
                />
              ))}
            </div>
            <Typography variant="body2" color="primary">
              {badge.description}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className={styles.cardLink}>
      {content}
    </Link>
  );
}
