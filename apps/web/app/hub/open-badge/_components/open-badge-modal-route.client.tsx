'use client';

import type { JSX } from 'react';
import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import type { OpenBadgeViewModel } from '@repo/application/open-badges/models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/application/users/models/user-summary';
import type { OpenBadgeAssignableUsersByBadgeIdAndLevel } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import OpenBadgeModal from '@repo/ui/open-badge/open-badge-modal';
import { assignOpenBadgeAction } from '../../../../lib/actions/open-badges/assign-open-badge';
import { useDelayedAction } from '@repo/ui/hooks/use-delayed-action';
import { useLocalModal } from '@repo/ui/hooks/use-local-modal';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';

type OpenBadgeModalRouteClientProps = {
  openBadge: OpenBadgeViewModel | null;
  closeHref: string;
  canAssign: boolean;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  userIdsByOpenBadgeIdAndLevel: OpenBadgeAssignableUsersByBadgeIdAndLevel;
};

export default function OpenBadgeModalRouteClient({
  openBadge,
  closeHref,
  canAssign,
  users,
  userIdsByOpenBadgeIdAndLevel
}: OpenBadgeModalRouteClientProps): JSX.Element | null {
  const t = useTranslations('pages.hub.openBadges.assignModal');
  const assignModal = useLocalModal({
    onOpen: () => {
      setFeedback(null);
      cancel();
    },
    onClose: () => {
      cancel();
      setFeedback(null);
    }
  });
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const { schedule, cancel } = useDelayedAction();
  const openBadgeId = openBadge?.id ?? null;
  const badgeModalPath = openBadgeId ? `${closeHref}/${openBadgeId}` : null;
  const { open, handleClose } = useRouteModal({
    modalPath: assignModal.open ? null : badgeModalPath,
    closeHref,
    onCloseStart: () => {
      setFeedback(null);
      cancel();
    }
  });

  const handleAssignClose = () => {
    assignModal.closeModal();
  };

  if (!openBadge) {
    return null;
  }

  const allowAssign = canAssign && users.length > 0;

  return (
    <>
      <OpenBadgeModal
        openBadge={openBadge}
        open={open}
        onAssign={
          allowAssign
            ? () => {
                assignModal.openModal();
              }
            : undefined
        }
        onClose={handleClose}
      />
      {allowAssign ? (
        <AssignOpenBadgeModal
          open={assignModal.open}
          onClose={handleAssignClose}
          user={null}
          users={users}
          openBadges={[openBadge]}
          userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
          translationNamespace="pages.hub.openBadges.assignModal"
          isSubmitting={isPending}
          feedback={feedback}
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

              schedule(handleAssignClose);
            });
          }}
        />
      ) : null}
    </>
  );
}
