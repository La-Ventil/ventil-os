'use client';

import type { MachineOpenBadgeRequirementViewModel } from '@repo/view-models/machine-details';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import styles from './machine-badge-requirement-card.module.css';

export type MachineBadgeRequirementCardProps = {
  requirement: MachineOpenBadgeRequirementViewModel;
  badgeTypeLabel: string;
  illustrationPlaceholder: string;
  showLock?: boolean;
};

export default function MachineBadgeRequirementCard({
  requirement,
  badgeTypeLabel,
  illustrationPlaceholder,
  showLock = false
}: MachineBadgeRequirementCardProps) {
  const typeLabel = requirement.badgeType ?? badgeTypeLabel;

  return (
    <Card className={styles.card} variant="outlined">
      <CardMedia className={styles.illustration} component="div">
        {requirement.badgeImageUrl ? (
          <img src={requirement.badgeImageUrl} alt={requirement.badgeName} />
        ) : (
          illustrationPlaceholder
        )}
      </CardMedia>
      <CardContent className={styles.content}>
        <Typography variant="overline" className={styles.typeLabel}>
          {typeLabel}
        </Typography>
        <Typography variant="subtitle2" className={styles.name}>
          {requirement.badgeName}
        </Typography>
        {requirement.badgeLevelTitle ? (
          <Typography variant="caption" className={styles.level}>
            {requirement.badgeLevelTitle}
          </Typography>
        ) : null}
      </CardContent>
      {showLock ? (
        <div className={styles.icon}>
          <LockOutlinedIcon fontSize="small" />
        </div>
      ) : null}
    </Card>
  );
}
