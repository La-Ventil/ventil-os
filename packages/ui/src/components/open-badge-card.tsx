'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import LevelChip from './level-chip';
import styles from './open-badge-card.module.css';

export type OpenBadgeLevel = {
  level: number;
  title?: string;
  body?: string;
};

export type OpenBadgeCardData = {
  id: string;
  type: string;
  title: string;
  description: string;
  levels: OpenBadgeLevel[];
  activeLevel: number;
};

export type OpenBadgeCardProps = {
  badge: OpenBadgeCardData;
  onClick?: () => void;
};

export default function OpenBadgeCard({ badge, onClick }: OpenBadgeCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <Card
      className={isInteractive ? `${styles.card} ${styles.cardInteractive}` : styles.card}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isInteractive) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <div className={styles.header}>
            <OpenBadgeIcon />
            <Box>
              <Typography variant="caption" color="primary">
                {badge.type}
              </Typography>
              <Typography variant="subtitle1">{badge.title}</Typography>
            </Box>
          </div>

          <Box display="flex" gap={2}>
            <div className={styles.illustration}>Illustration en cours</div>
            <Stack spacing={1} flex={1}>
              <div className={styles.levelRow}>
                {badge.levels.map((levelEntry) => (
                  <LevelChip
                    key={`${badge.id}-level-${levelEntry.level}`}
                    level={levelEntry.level}
                    isActive={levelEntry.level === badge.activeLevel}
                    className={styles.levelChip}
                  />
                ))}
              </div>
              <Typography variant="body2" color="text.secondary">
                {badge.description}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
