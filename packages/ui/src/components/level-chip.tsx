'use client';

import Chip from '@mui/material/Chip';

export type LevelChipProps = {
  level: number;
  isActive?: boolean;
  className?: string;
};

export default function LevelChip({ level, isActive = false, className }: LevelChipProps) {
  return (
    <Chip
      label={level}
      size="small"
      variant={isActive ? 'filled' : 'outlined'}
      color={isActive ? 'primary' : 'default'}
      className={className}
    />
  );
}
