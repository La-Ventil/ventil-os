'use client';

import { useTransition } from 'react';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import RowQuickActionsMenu from '@repo/ui/admin/row-quick-actions-menu';
import { setUserBlockedAction } from '../../../../lib/actions/set-user-blocked';

type UserQuickActionsProps = {
  user: UserAdminViewModel;
  labels: {
    manage: string;
    edit: string;
    openBadges: string;
    block: string;
    unblock: string;
  };
};

export default function UserQuickActions({ user, labels }: UserQuickActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleBlocked = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set('userId', user.id);
      formData.set('blocked', user.blocked ? 'false' : 'true');
      await setUserBlockedAction(formData);
    });
  };

  return (
    <RowQuickActionsMenu
      label={labels.manage}
      disabled={isPending}
      items={[
        { label: labels.openBadges, href: `/hub/admin/users/${user.id}/open-badges` },
        { label: labels.edit, href: `/hub/admin/users/${user.id}/edit` },
        { label: user.blocked ? labels.unblock : labels.block, onClick: handleToggleBlocked }
      ]}
    />
  );
}
