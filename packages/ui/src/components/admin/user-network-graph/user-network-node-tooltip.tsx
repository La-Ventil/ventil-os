import type { ReactElement } from 'react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type UserNetworkGraphNodeTooltipProps = {
  open: boolean;
  fullName: string;
  roleLabel: string;
  roleColor: string;
  children: ReactElement;
};

export default function UserNetworkGraphNodeTooltip({
  open,
  fullName,
  roleLabel,
  roleColor,
  children
}: UserNetworkGraphNodeTooltipProps) {
  return (
    <Tooltip
      open={open}
      disableInteractive
      placement="top"
      arrow
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -6]
              }
            }
          ]
        }
      }}
      title={
        <span>
          <Typography component="span" variant="subtitle2" sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
            {fullName}
          </Typography>
          <Chip
            size="small"
            label={roleLabel}
            sx={{
              mt: 0.5,
              height: 22,
              borderRadius: 999,
              fontWeight: 800,
              color: '#fff',
              backgroundColor: roleColor,
              '& .MuiChip-label': {
                color: 'inherit'
              }
            }}
          />
        </span>
      }
    >
      <span>{children}</span>
    </Tooltip>
  );
}
