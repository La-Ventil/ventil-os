'use client';

import { useTransition } from 'react';
import type { UserAdminViewModel } from '@repo/application/users/models/user-admin';
import RowQuickActionsMenu from '@repo/ui/admin/row-quick-actions-menu';
import { setUserBlockedAction } from '../../../../../lib/actions/users/set-user-blocked';

type UserQuickActionsProps = {
  user: UserAdminViewModel;
  currentUserId: string | null;
  labels: {
    manage: string;
    edit: string;
    openBadges: string;
    block: string;
    unblock: string;
  };
};

export default function UserQuickActions({ user, currentUserId, labels }: UserQuickActionsProps) {
  const [isPending, startTransition] = useTransition();
  const cannotBlockUser = !user.blocked && (user.globalAdmin || user.pedagogicalAdmin || user.id === currentUserId);

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
        {
          label: user.blocked ? labels.unblock : labels.block,
          onClick: handleToggleBlocked,
          disabled: cannotBlockUser
        }
      ]}
    />
  );
}
