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
      variant="filled"
      color={isActive ? 'secondary' : 'default'}
      className={className}
    />
  );
}
