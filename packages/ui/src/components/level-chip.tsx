import Chip from '@mui/material/Chip';

export type LevelChipProps = {
  level: number;
  isActive?: boolean;
  className?: string;
  size?: 'small' | 'medium';
};

export default function LevelChip({
  level,
  isActive = false,
  className,
  size = 'small'
}: LevelChipProps) {
  return (
    <Chip
      label={level}
      size={size}
      variant="filled"
      color={isActive ? 'secondary' : 'default'}
      className={className}
    />
  );
}
