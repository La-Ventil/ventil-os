'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import { assignOpenBadgeAction } from '../../../../lib/actions/assign-open-badge';
import { useDelayedAction } from '../../../../lib/hooks/use-delayed-action';
import { fieldErrorsToSingleMessage } from '../../../../lib/validation';

type AssignOpenBadgeModalRouteProps = {
  openBadge: OpenBadgeViewModel | null;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  translationNamespace?: string;
  closeHref: string;
};

export default function AssignOpenBadgeModalRoute({
  openBadge,
  users,
  translationNamespace = 'pages.hub.admin.openBadges.assignModal',
  closeHref
}: AssignOpenBadgeModalRouteProps): JSX.Element | null {
  const router = useRouter();
  const t = useTranslations(translationNamespace);
  const [isOpen, setIsOpen] = useState(Boolean(openBadge));
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
    setIsOpen(Boolean(openBadge));
    if (openBadge) {
      cancel();
      setFeedback(null);
    }
  }, [openBadge, cancel]);

  useEffect(() => {
    if (isOpen) {
      cancel();
      setFeedback(null);
    }
  }, [isOpen, cancel]);

  if (!openBadge) {
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
      user={null}
      users={users}
      openBadge={openBadge}
      translationNamespace={translationNamespace}
      isSubmitting={isPending}
      feedback={feedback}
    />
  );
}
