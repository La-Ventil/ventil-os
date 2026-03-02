'use client';

import { useId } from 'react';
import AssignOpenBadgeForm from '../forms/assign-open-badge.form';
import ModalLayout from '../modal-layout';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import { ThemeSection } from '../../theme';

type AssignOpenBadgeModalProps = {
  open: boolean;
  onClose: () => void;
  user: UserSummaryWithOpenBadgeLevelViewModel | null;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  openBadges: OpenBadgeViewModel[];
  translationNamespace?: string;
  isSubmitting?: boolean;
  userSelectionDisabled?: boolean;
  onConfirm: (payload: { userId: string; openBadgeId: string; level: number }) => void;
  onRemove?: (payload: { userId: string; openBadgeId: string }) => Promise<{ success: boolean; message?: string }>;
  feedback?: { type: 'error' | 'success'; message: string } | null;
};

export default function AssignOpenBadgeModal({
  open,
  onClose,
  user,
  users,
  openBadges,
  translationNamespace = 'pages.hub.admin.users.assignModal',
  isSubmitting = false,
  userSelectionDisabled,
  onConfirm,
  onRemove,
  feedback = null
}: AssignOpenBadgeModalProps) {
  const t = useTranslations(translationNamespace);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      closeLabel={t('cancel')}
      fullWidth
      maxWidth="sm"
      themeSection={ThemeSection.OpenBadge}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descriptionId}
    >
      <AssignOpenBadgeForm
        titleId={titleId}
        descriptionId={descriptionId}
        user={user}
        users={users}
        openBadges={openBadges}
        translationNamespace={translationNamespace}
        isSubmitting={isSubmitting}
        userSelectionDisabled={userSelectionDisabled}
        onConfirm={onConfirm}
        onRemove={onRemove}
        onCancel={onClose}
        feedback={feedback}
      />
    </ModalLayout>
  );
}
