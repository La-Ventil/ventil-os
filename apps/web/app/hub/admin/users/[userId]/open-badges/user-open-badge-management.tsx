'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import type { FormFieldErrors } from '@repo/form/form-state';
import AdminActionsSection from '@repo/ui/admin/admin-actions-section';
import AdminButton from '@repo/ui/admin/admin-button';
import UserOpenBadgesTable from '@repo/ui/admin/user-open-badges-table';
import Section from '@repo/ui/section';
import { assignOpenBadgeAction } from '../../../../../../lib/actions/open-badges/assign-open-badge';
import { removeUserOpenBadgeAction } from '../../../../../../lib/actions/users/remove-user-open-badge';
import { setUserOpenBadgeLevelAction } from '../../../../../../lib/actions/users/set-user-open-badge-level';
import type { UserAdminViewModel } from '@repo/application/users/models/user-admin';
import type { OpenBadgeViewModel } from '@repo/application/open-badges/models/open-badge';
import styles from './user-open-badge-management.module.css';

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
  const [pageFeedback, setPageFeedback] = useState<FormFeedback | null>(null);

  const resolvePageFeedback = <TValues,>(state: {
    success: boolean;
    message?: string;
    fieldErrors: FormFieldErrors<TValues>;
  }): FormFeedback | null =>
    resolveFormFeedback(state, {
      fallbackErrorMessage: labels.feedback.genericError,
      errorStrategy: 'join-fields'
    });

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
        <AdminButton
          component={Link}
          href={`/hub/admin/users/${user.id}/open-badges/assign`}
          disabled={!assignableBadges.length || isPending}
        >
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
    </>
  );
}
