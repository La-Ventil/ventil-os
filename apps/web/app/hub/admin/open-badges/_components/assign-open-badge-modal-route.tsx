'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import type { OpenBadgeViewModel } from '@repo/application/open-badges/models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/application/users/models/user-summary';
import type { OpenBadgeAssignableUsersByBadgeIdAndLevel } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import { assignOpenBadgeAction } from '../../../../../lib/actions/open-badges/assign-open-badge';
import { useDelayedAction } from '@repo/ui/hooks/use-delayed-action';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';

type AssignOpenBadgeModalRouteProps = {
  openBadge: OpenBadgeViewModel | null;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  userIdsByOpenBadgeIdAndLevel: OpenBadgeAssignableUsersByBadgeIdAndLevel;
  translationNamespace?: string;
  closeHref: string;
};

export default function AssignOpenBadgeModalRoute({
  openBadge,
  users,
  userIdsByOpenBadgeIdAndLevel,
  translationNamespace = 'pages.hub.admin.openBadges.assignModal',
  closeHref
}: AssignOpenBadgeModalRouteProps): JSX.Element | null {
  const t = useTranslations(translationNamespace);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const { schedule, cancel } = useDelayedAction();
  const openBadgeId = openBadge?.id ?? null;
  const assignModalPath = openBadgeId ? `/hub/admin/open-badges/${openBadgeId}` : null;
  const { open, handleClose } = useRouteModal({
    modalPath: assignModalPath,
    closeHref,
    onCloseStart: () => {
      cancel();
      setFeedback(null);
    }
  });

  useEffect(() => {
    if (openBadgeId) {
      cancel();
      setFeedback(null);
    }
  }, [openBadgeId, cancel]);

  useEffect(() => {
    if (open) {
      cancel();
      setFeedback(null);
    }
  }, [open, cancel]);

  if (!openBadge) {
    return null;
  }

  return (
    <AssignOpenBadgeModal
      open={open}
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
      userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
      translationNamespace={translationNamespace}
      isSubmitting={isPending}
      feedback={feedback}
    />
  );
}
