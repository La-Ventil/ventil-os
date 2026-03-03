'use client';

import { useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AdminActionsSection from '@repo/ui/admin/admin-actions-section';
import AdminButton from '@repo/ui/admin/admin-button';
import AdminTable from '@repo/ui/admin/admin-table';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import ListEmptyState from '@repo/ui/list-empty-state';
import Section from '@repo/ui/section';
import RowQuickActionsMenu from '../row-quick-actions-menu';
import { assignOpenBadgeAction } from '../../../../lib/actions/assign-open-badge';
import { removeUserOpenBadgeAction } from '../../../../lib/actions/remove-user-open-badge';
import { setUserOpenBadgeLevelAction } from '../../../../lib/actions/set-user-open-badge-level';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import { OpenBadge } from '@repo/domain/badge/open-badge';
import { formatOpenBadgeLevelLabel } from '@repo/domain/badge/open-badge-level';
import styles from './user-open-badge-management.module.css';

type Feedback = { type: 'error' | 'success'; message: string } | null;

type UserOpenBadgeManagementProps = {
  user: UserAdminViewModel;
  badges: OpenBadgeViewModel[];
  assignableBadges: OpenBadgeViewModel[];
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
  labels
}: UserOpenBadgeManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [pageFeedback, setPageFeedback] = useState<Feedback>(null);
  const [modalFeedback, setModalFeedback] = useState<Feedback>(null);

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

  const handleAssign = (payload: { userId: string; openBadgeId: string; level: number }) => {
    startTransition(async () => {
      setModalFeedback(null);
      const result = await assignOpenBadgeAction(payload);

      if (!result.success) {
        setModalFeedback({
          type: 'error',
          message: result.message ?? labels.feedback.genericError
        });
        return;
      }

      closeAssignModal();
      setPageFeedback({
        type: 'success',
        message: result.message ?? labels.feedback.genericError
      });
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

      setPageFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message ?? labels.feedback.genericError
      });
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

      setPageFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message ?? labels.feedback.genericError
      });
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

      setPageFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message ?? labels.feedback.genericError
      });
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
        {badges.length ? (
          <AdminTable>
            <TableHead>
              <TableRow>
                <TableCell>{labels.columns.actions}</TableCell>
                <TableCell>{labels.columns.image}</TableCell>
                <TableCell>{labels.columns.badge}</TableCell>
                <TableCell>{labels.columns.level}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {badges.map((badge) => {
                const nextLevel = badge.levels.find((level) => level.level === badge.activeLevel + 1);
                const previousLevel = badge.levels.find((level) => level.level === badge.activeLevel - 1);
                const activeLevel = OpenBadge.getActiveLevel(badge);

                return (
                  <TableRow key={badge.id} hover>
                    <TableCell>
                      <RowQuickActionsMenu
                        label={labels.actions.manage}
                        disabled={isPending}
                        items={[
                          {
                            label: labels.actions.upgrade,
                            disabled: !nextLevel,
                            onClick: nextLevel ? () => handleUpgrade(badge, nextLevel.level) : undefined
                          },
                          {
                            label: labels.actions.downgrade,
                            disabled: !previousLevel,
                            onClick: previousLevel
                              ? () => handleDowngrade(badge, previousLevel.level)
                              : undefined
                          },
                          { label: labels.actions.remove, onClick: () => handleRemove(badge) }
                        ]}
                      />
                    </TableCell>
                    <TableCell>
                      {badge.coverImage ? (
                        <Image
                          src={badge.coverImage}
                          alt={badge.name}
                          width={48}
                          height={48}
                          className={styles.coverImage}
                        />
                      ) : (
                        <span className={styles.coverPlaceholder}>OB</span>
                      )}
                    </TableCell>
                    <TableCell>{badge.name}</TableCell>
                    <TableCell>{activeLevel ? formatOpenBadgeLevelLabel(activeLevel) : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </AdminTable>
        ) : (
          <ListEmptyState title={labels.empty.title} description={labels.empty.description} />
        )}
      </Section>

      <AssignOpenBadgeModal
        open={isAssignOpen}
        onClose={closeAssignModal}
        user={selectedUser}
        users={[selectedUser]}
        openBadges={assignableBadges}
        translationNamespace="pages.hub.admin.users.badgeManagement.assignDialog"
        isSubmitting={isPending}
        userSelectionDisabled
        onConfirm={handleAssign}
        feedback={modalFeedback}
      />
    </>
  );
}
