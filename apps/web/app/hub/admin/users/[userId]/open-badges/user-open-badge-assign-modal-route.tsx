'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import type { UserAdminViewModel } from '@repo/application/users/models/user-admin';
import type { OpenBadgeViewModel } from '@repo/application/open-badges/models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/application/users/models/user-summary';
import type { OpenBadgeAssignableUsersByBadgeIdAndLevel } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';
import { assignOpenBadgeAction } from '../../../../../../lib/actions/open-badges/assign-open-badge';

type UserOpenBadgeAssignModalRouteProps = {
  user: UserAdminViewModel;
  assignableBadges: OpenBadgeViewModel[];
  userIdsByOpenBadgeIdAndLevel: OpenBadgeAssignableUsersByBadgeIdAndLevel;
  closeHref: string;
};

export default function UserOpenBadgeAssignModalRoute({
  user,
  assignableBadges,
  userIdsByOpenBadgeIdAndLevel,
  closeHref
}: UserOpenBadgeAssignModalRouteProps) {
  const router = useRouter();
  const t = useTranslations('pages.hub.admin.users.badgeManagement.assignDialog');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const modalPath = `${closeHref}/assign`;
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref,
    onCloseStart: () => setFeedback(null)
  });

  const selectedUser = useMemo<UserSummaryWithOpenBadgeLevelViewModel>(
    () => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      image: user.image,
      avatar: user.avatar,
      email: user.email,
      fullName: user.fullName,
      currentOpenBadgeLevel: null
    }),
    [user]
  );

  return (
    <AssignOpenBadgeModal
      open={open}
      onClose={handleClose}
      user={selectedUser}
      users={[selectedUser]}
      openBadges={assignableBadges}
      userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
      translationNamespace="pages.hub.admin.users.badgeManagement.assignDialog"
      isSubmitting={isPending}
      userSelectionDisabled
      feedback={feedback}
      onConfirm={(payload) => {
        startTransition(async () => {
          setFeedback(null);
          const result = await assignOpenBadgeAction(payload);
          const nextFeedback = resolveFormFeedback(result, {
            fallbackErrorMessage: t('error'),
            errorStrategy: 'join-fields'
          });

          if (!result.success) {
            setFeedback(nextFeedback);
            return;
          }

          handleClose();
          router.refresh();
        });
      }}
    />
  );
}
