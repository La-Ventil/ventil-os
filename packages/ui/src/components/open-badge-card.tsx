'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import type { OpenBadgeViewModel, OpenBadgeLevelViewModel as DomainOpenBadgeLevel } from '@repo/domain/view-models/open-badge';
import CardHeader from './card-header';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import LevelChip from './level-chip';
import styles from './open-badge-card.module.css';

export type OpenBadgeLevel = DomainOpenBadgeLevel;
export type OpenBadgeCardData = OpenBadgeViewModel;

export type OpenBadgeCardProps = {
  badge: OpenBadgeCardData;
  onClick?: () => void;
};

export default function OpenBadgeCard({ badge, onClick }: OpenBadgeCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <Card
      className={clsx(styles.card, isInteractive && styles.cardInteractive)}
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
      <CardHeader icon={<OpenBadgeIcon color="secondary" />} overline={badge.type} title={badge.name} />
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" gap={2}>
            <CardMedia className={styles.illustration} component="div">
              {badge.coverImage ? (
                <img src={badge.coverImage} alt={badge.name} className={styles.illustration} />
              ) : (
                'Illustration en cours'
              )}
            </CardMedia>
            <Stack flex={1}>
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
              <Typography variant="body2" color="primary">
                {badge.description}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
