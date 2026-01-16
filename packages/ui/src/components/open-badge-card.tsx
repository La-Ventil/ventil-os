'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import styles from './open-badge-card.module.css';

export type OpenBadgeCardData = {
  id: string;
  type: string;
  title: string;
  description: string;
  levels: number[];
  activeLevel: number;
};

export type OpenBadgeCardProps = {
  badge: OpenBadgeCardData;
};

export default function OpenBadgeCard({ badge }: OpenBadgeCardProps) {
  // for levels ? https://mui.com/material-ui/react-chip/
  return (
    <Card className={styles.card}>
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
                {badge.levels.map((level) =>
                  level === badge.activeLevel ? (
                    <Chip className={styles.levelDotActive} label={level} size="small" key={`${badge.id}-level-${level}`} />
                  ) : (
                    <Chip className={styles.levelDotInactive} label={level} size="small" key={`${badge.id}-level-${level}`} />
                  )
                )}
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
