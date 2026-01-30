'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import AssignOpenBadgeDialog from '@repo/ui/admin/assign-open-badge-dialog';
import { assignOpenBadge } from '../../../../lib/actions/assign-open-badge';
import { fieldErrorsToSingleMessage } from '../../../../lib/validation';

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
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

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
          setFeedback(null);
          const result = await assignOpenBadge(payload);

          if (!result.success) {
            const firstFieldError = result.fieldErrors
              ? fieldErrorsToSingleMessage(result.fieldErrors, { maxMessages: 1 })
              : undefined;
            setFeedback({
              type: 'error',
              message: firstFieldError ?? result.message ?? labels.error
            });
            return;
          }

          setFeedback({ type: 'success', message: result.message ?? labels.confirm });
          setIsOpen(false);
          router.push(closeHref);
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
