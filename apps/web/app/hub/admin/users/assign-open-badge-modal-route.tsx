'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import { assignOpenBadgeAction } from '../../../../lib/actions/assign-open-badge';
import { removeUserOpenBadgeAction } from '../../../../lib/actions/remove-user-open-badge';
import { useDelayedAction } from '../../../../lib/hooks/use-delayed-action';
import { fieldErrorsToSingleMessage } from '../../../../lib/validation';

type AssignOpenBadgeModalRouteProps = {
  user: UserSummaryWithOpenBadgeLevelViewModel | null;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  openBadges: OpenBadgeViewModel[];
  translationNamespace?: string;
  closeHref: string;
};

export default function AssignOpenBadgeModalRoute({
  user,
  users,
  openBadges,
  translationNamespace = 'pages.hub.admin.users.assignModal',
  closeHref
}: AssignOpenBadgeModalRouteProps): JSX.Element | null {
  const router = useRouter();
  const t = useTranslations(translationNamespace);
  const [isOpen, setIsOpen] = useState(Boolean(user));
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { schedule, cancel } = useDelayedAction();

  const handleClose = () => {
    cancel();
    setFeedback(null);
    setIsOpen(false);
    router.push(closeHref);
  };

  useEffect(() => {
    setIsOpen(Boolean(user));
    if (user) {
      cancel();
      setFeedback(null);
    }
  }, [user, cancel]);

  useEffect(() => {
    if (isOpen) {
      cancel();
      setFeedback(null);
    }
  }, [isOpen, cancel]);

  if (!openBadges[0]) {
    return null;
  }

  return (
    <AssignOpenBadgeModal
      open={isOpen}
      onClose={handleClose}
      onConfirm={(payload) => {
        startTransition(async () => {
          setFeedback(null);
          const result = await assignOpenBadgeAction(payload);

          if (!result.success) {
            const firstFieldError = result.fieldErrors
              ? fieldErrorsToSingleMessage(result.fieldErrors, { maxMessages: 1 })
              : undefined;
            setFeedback({
              type: 'error',
              message: firstFieldError ?? result.message ?? t('error')
            });
            return;
          }

          setFeedback({ type: 'success', message: result.message ?? t('confirm') });
          schedule(handleClose);
        });
      }}
      user={user}
      users={users}
      openBadges={openBadges}
      translationNamespace={translationNamespace}
      isSubmitting={isPending}
      feedback={feedback}
      onRemove={
        user
          ? (payload) => {
              return removeUserOpenBadgeAction(payload);
            }
          : undefined
      }
    />
  );
}
