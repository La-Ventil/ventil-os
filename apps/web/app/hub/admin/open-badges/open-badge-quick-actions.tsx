'use client';

import { useState, useTransition } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { OpenBadgeAdminStatus, type OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import { setOpenBadgeStatusAction } from '../../../../lib/actions/set-open-badge-status';
import { removeOpenBadgeAction } from '../../../../lib/actions/remove-open-badge';

type OpenBadgeQuickActionsProps = {
  badge: OpenBadgeAdminViewModel;
  labels: {
    manage: string;
    edit: string;
    activate: string;
    deactivate: string;
    remove: string;
  };
};

export default function OpenBadgeQuickActions({ badge, labels }: OpenBadgeQuickActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPending, startTransition] = useTransition();
  const isOpen = Boolean(anchorEl);
  const canRemove = badge.assignedCount === 0;

  const handleClose = () => setAnchorEl(null);

  const handleToggleStatus = () => {
    const nextStatus =
      badge.status === OpenBadgeAdminStatus.Active
        ? OpenBadgeAdminStatus.Inactive
        : OpenBadgeAdminStatus.Active;

    startTransition(async () => {
      const formData = new FormData();
      formData.set('badgeId', badge.id);
      formData.set('nextStatus', nextStatus);
      await setOpenBadgeStatusAction(formData);
    });
  };

  const handleRemove = () => {
    if (!canRemove) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set('badgeId', badge.id);
      await removeOpenBadgeAction(formData);
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<ExpandMoreIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disabled={isPending}
      >
        {labels.manage}
      </Button>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
        <MenuItem component={Link} href={`/hub/admin/open-badges/${badge.id}/edit`} onClick={handleClose}>
          {labels.edit}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            handleToggleStatus();
          }}
        >
          {badge.status === OpenBadgeAdminStatus.Active ? labels.deactivate : labels.activate}
        </MenuItem>
        <MenuItem
          disabled={!canRemove}
          onClick={() => {
            handleClose();
            handleRemove();
          }}
        >
          {labels.remove}
        </MenuItem>
      </Menu>
    </>
  );
}
