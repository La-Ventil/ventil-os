'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

export type RowQuickActionItem = {
  label: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
};

type RowQuickActionsMenuProps = {
  label: string;
  items: RowQuickActionItem[];
  disabled?: boolean;
};

export default function RowQuickActionsMenu({ label, items, disabled = false }: RowQuickActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const menuId = 'row-quick-actions-menu';
  const buttonId = 'row-quick-actions-button';

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<ExpandMoreIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disabled={disabled}
        id={buttonId}
        aria-controls={isOpen ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
      >
        {label}
      </Button>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': buttonId
          }
        }}
      >
        {items.map((item) =>
          item.href ? (
            <MenuItem
              key={item.label}
              component={Link}
              href={item.href}
              onClick={handleClose}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={item.label}
              onClick={() => {
                handleClose();
                item.onClick?.();
              }}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
}
