'use client';

import { useTransition } from 'react';
import { OpenBadgeAdminStatus, type OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import { setOpenBadgeStatusAction } from '../../../../lib/actions/set-open-badge-status';
import { removeOpenBadgeAction } from '../../../../lib/actions/remove-open-badge';
import RowQuickActionsMenu from '../row-quick-actions-menu';

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
  const [isPending, startTransition] = useTransition();
  const canRemove = badge.assignedCount === 0;
  const canToggleStatus =
    badge.status !== OpenBadgeAdminStatus.Active || badge.machineLinksCount === 0;

  const handleToggleStatus = () => {
    if (!canToggleStatus) {
      return;
    }

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
    <RowQuickActionsMenu
      label={labels.manage}
      disabled={isPending}
      items={[
        { label: labels.edit, href: `/hub/admin/open-badges/${badge.id}/edit` },
        {
          label: badge.status === OpenBadgeAdminStatus.Active ? labels.deactivate : labels.activate,
          onClick: handleToggleStatus,
          disabled: !canToggleStatus
        },
        { label: labels.remove, onClick: handleRemove, disabled: !canRemove }
      ]}
    />
  );
}
