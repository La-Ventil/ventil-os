import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type ListEmptyStateServerProps = {
  title: string;
  description?: string;
};

export default function ListEmptyStateServer({ title, description }: ListEmptyStateServerProps): React.ReactNode {
  return (
    <Stack alignItems="center" spacing={1} py={2} textAlign="center">
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {description ? (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Stack>
  );
}
