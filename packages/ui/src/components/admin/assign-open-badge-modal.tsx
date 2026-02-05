'use client';

import AssignOpenBadgeForm from '../forms/assign-open-badge.form';
import ModalLayout from '../modal-layout';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { ThemeSection } from '../../theme';

type AssignOpenBadgeModalProps = {
  open: boolean;
  onClose: () => void;
  user: { id: string; firstName: string; lastName?: string } | null;
  users: Array<{ id: string; label: string }>;
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
