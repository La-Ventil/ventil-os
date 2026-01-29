"use client";

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import AssignOpenBadgeDialog from '@repo/ui/admin/assign-open-badge-dialog';
import { assignOpenBadge } from '../../../../lib/actions/assign-open-badge';

type AssignOpenBadgeModalRouteProps = {
  user: UserAdminViewModel | null;
  users: Array<{ id: string; label: string }>;
  openBadges: OpenBadgeViewModel[];
  labels: {
    title: string;
    subtitle: string;
    badgeLabel: string;
    levelLabel: string;
    userLabel: string;
    cancel: string;
    confirm: string;
    illustrationPlaceholder: string;
    error: string;
  };
  closeHref: string;
};

export default function AssignOpenBadgeModalRoute({
  user,
  users,
  openBadges,
  labels,
  closeHref
}: AssignOpenBadgeModalRouteProps): JSX.Element | null {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(Boolean(user));
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );

  useEffect(() => {
    setIsOpen(Boolean(user));
  }, [user]);

  return (
    <AssignOpenBadgeDialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
      onConfirm={(payload) => {
        startTransition(async () => {
          try {
            setFeedback(null);
            await assignOpenBadge(payload);
            setIsOpen(false);
            router.push(closeHref);
          } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: labels.error });
          }
        });
      }}
      user={user}
      users={users}
      openBadges={openBadges}
      labels={labels}
      isSubmitting={isPending}
      feedback={feedback}
    />
  );
}
