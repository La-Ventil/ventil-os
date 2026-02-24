'use client';

import AssignOpenBadgeForm from '../forms/assign-open-badge.form';
import ModalLayout from '../modal-layout';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { ThemeSection } from '../../theme';

type AssignOpenBadgeModalProps = {
  open: boolean;
  onClose: () => void;
  user: UserSummaryViewModel | null;
  users: UserSummaryViewModel[];
  openBadge: OpenBadgeViewModel;
  translationNamespace?: string;
  isSubmitting?: boolean;
  userSelectionDisabled?: boolean;
  onConfirm: (payload: { userId: string; openBadgeId: string; level: number }) => void;
  feedback?: { type: 'error' | 'success'; message: string } | null;
};

export default function AssignOpenBadgeModal({
  open,
  onClose,
  user,
  users,
  openBadge,
  translationNamespace = 'pages.hub.admin.users.assignModal',
  isSubmitting = false,
  userSelectionDisabled,
  onConfirm,
  feedback = null
}: AssignOpenBadgeModalProps) {
  const t = useTranslations(translationNamespace);

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      closeLabel={t('cancel')}
      fullWidth
      maxWidth="sm"
      themeSection={ThemeSection.OpenBadge}
    >
      <AssignOpenBadgeForm
        user={user}
        users={users}
        openBadge={openBadge}
        translationNamespace={translationNamespace}
        isSubmitting={isSubmitting}
        userSelectionDisabled={userSelectionDisabled}
        onConfirm={onConfirm}
        onCancel={onClose}
        feedback={feedback}
      />
    </ModalLayout>
  );
}
