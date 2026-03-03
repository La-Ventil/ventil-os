'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import { assignOpenBadgeAction } from '../../../../lib/actions/open-badges/assign-open-badge';
import { useDelayedAction } from '@repo/ui/hooks/use-delayed-action';

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
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const { schedule, cancel } = useDelayedAction();
  const openBadgeId = openBadge?.id ?? null;

  const handleClose = () => {
    cancel();
    setFeedback(null);
    setIsOpen(false);
    router.push(closeHref);
  };

  useEffect(() => {
    setIsOpen(Boolean(openBadgeId));
    if (openBadgeId) {
      cancel();
      setFeedback(null);
    }
  }, [openBadgeId, cancel]);

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
          const nextFeedback = resolveFormFeedback(result, {
            fallbackErrorMessage: t('error'),
            fallbackSuccessMessage: t('confirm'),
            errorStrategy: 'join-fields'
          });

          if (nextFeedback) {
            setFeedback(nextFeedback);
          }

          if (!result.success) {
            return;
          }

          schedule(handleClose);
        });
      }}
      user={null}
      users={users}
      openBadges={[openBadge]}
      translationNamespace={translationNamespace}
      isSubmitting={isPending}
      feedback={feedback}
    />
  );
}
