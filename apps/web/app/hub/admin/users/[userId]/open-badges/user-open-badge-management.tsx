'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import AdminActionsSection from '@repo/ui/admin/admin-actions-section';
import AdminButton from '@repo/ui/admin/admin-button';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import UserOpenBadgesTable from '@repo/ui/admin/user-open-badges-table';
import Section from '@repo/ui/section';
import { assignOpenBadgeAction } from '../../../../../../lib/actions/open-badges/assign-open-badge';
import { removeUserOpenBadgeAction } from '../../../../../../lib/actions/users/remove-user-open-badge';
import { setUserOpenBadgeLevelAction } from '../../../../../../lib/actions/users/set-user-open-badge-level';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import type { OpenBadgeAssignableUsersByBadgeIdAndLevel } from '@repo/application/open-badges/usecases';
import styles from './user-open-badge-management.module.css';

type UserOpenBadgeManagementProps = {
  user: UserAdminViewModel;
  badges: OpenBadgeViewModel[];
  assignableBadges: OpenBadgeViewModel[];
  userIdsByOpenBadgeIdAndLevel: OpenBadgeAssignableUsersByBadgeIdAndLevel;
  labels: {
    actions: {
      assign: string;
      manage: string;
      upgrade: string;
      downgrade: string;
      remove: string;
    };
    columns: {
      actions: string;
      image: string;
      badge: string;
      level: string;
    };
    empty: {
      title: string;
      description: string;
    };
    feedback: {
      genericError: string;
    };
  };
};

export default function UserOpenBadgeManagement({
  user,
  badges,
  assignableBadges,
  userIdsByOpenBadgeIdAndLevel,
  labels
}: UserOpenBadgeManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [pageFeedback, setPageFeedback] = useState<FormFeedback | null>(null);
  const [modalFeedback, setModalFeedback] = useState<FormFeedback | null>(null);

  const selectedUser = useMemo<UserSummaryWithOpenBadgeLevelViewModel>(
    () => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      image: user.image,
      email: user.email,
      fullName: user.fullName,
      currentOpenBadgeLevel: null
    }),
    [user]
  );

  const closeAssignModal = () => {
    setModalFeedback(null);
    setIsAssignOpen(false);
  };

  const resolvePageFeedback = <TValues,>(state: {
    success: boolean;
    message?: string;
    fieldErrors: Partial<Record<keyof TValues, string[]>>;
  }): FormFeedback | null =>
    resolveFormFeedback(state, {
      fallbackErrorMessage: labels.feedback.genericError,
      errorStrategy: 'join-fields'
    });

  const handleAssign = (payload: { userId: string; openBadgeId: string; level: number }) => {
    startTransition(async () => {
      setModalFeedback(null);
      const result = await assignOpenBadgeAction(payload);
      const nextFeedback = resolvePageFeedback(result);

      if (!result.success) {
        setModalFeedback(nextFeedback);
        return;
      }

      closeAssignModal();
      setPageFeedback(nextFeedback);
      router.refresh();
    });
  };

  const handleUpgrade = (badge: OpenBadgeViewModel, nextLevel: number) => {
    startTransition(async () => {
      setPageFeedback(null);
      const result = await assignOpenBadgeAction({
        userId: user.id,
        openBadgeId: badge.id,
        level: nextLevel
      });
      setPageFeedback(resolvePageFeedback(result));
      if (result.success) {
        router.refresh();
      }
    });
  };

  const handleDowngrade = (badge: OpenBadgeViewModel, previousLevel: number) => {
    startTransition(async () => {
      setPageFeedback(null);
      const result = await setUserOpenBadgeLevelAction({
        userId: user.id,
        openBadgeId: badge.id,
        level: previousLevel
      });
      setPageFeedback(resolvePageFeedback(result));
      if (result.success) {
        router.refresh();
      }
    });
  };

  const handleRemove = (badge: OpenBadgeViewModel) => {
    startTransition(async () => {
      setPageFeedback(null);
      const result = await removeUserOpenBadgeAction({
        userId: user.id,
        openBadgeId: badge.id
      });
      setPageFeedback(resolvePageFeedback(result));
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <>
      <AdminActionsSection>
        <AdminButton onClick={() => setIsAssignOpen(true)} disabled={!assignableBadges.length || isPending}>
          {labels.actions.assign}
        </AdminButton>
      </AdminActionsSection>

      {pageFeedback ? (
        <Section pt={0} pb={2}>
          <Alert severity={pageFeedback.type} className={styles.feedback}>
            {pageFeedback.message}
          </Alert>
        </Section>
      ) : null}

      <Section pt={0}>
        <UserOpenBadgesTable
          badges={badges}
          isPending={isPending}
          labels={labels}
          onUpgrade={handleUpgrade}
          onDowngrade={handleDowngrade}
          onRemove={handleRemove}
        />
      </Section>

      <AssignOpenBadgeModal
        open={isAssignOpen}
        onClose={closeAssignModal}
        user={selectedUser}
        users={[selectedUser]}
        openBadges={assignableBadges}
        userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
        translationNamespace="pages.hub.admin.users.badgeManagement.assignDialog"
        isSubmitting={isPending}
        userSelectionDisabled
        onConfirm={handleAssign}
        feedback={modalFeedback}
      />
    </>
  );
}
