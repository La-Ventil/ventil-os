'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import { assignOpenBadge } from '../../../../lib/actions/assign-open-badge';
import { fieldErrorsToSingleMessage } from '../../../../lib/validation';

type AssignOpenBadgeModalRouteProps = {
  openBadge: OpenBadgeViewModel | null;
  users: Array<{ id: string; label: string }>;
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
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    setIsOpen(Boolean(openBadge));
  }, [openBadge]);

  if (!openBadge) {
    return null;
  }

  return (
    <AssignOpenBadgeModal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
      onConfirm={(payload) => {
        startTransition(async () => {
          setFeedback(null);
          const result = await assignOpenBadge(payload);

          if (!result.success) {
            const firstFieldError = result.fieldErrors
              ? fieldErrorsToSingleMessage(result.fieldErrors, { maxMessages: 1 })
              : undefined;
            setFeedback({
              type: 'error',
              message: firstFieldError ?? result.message ?? t('error')
            });
            return;
          }

          setFeedback({ type: 'success', message: result.message ?? t('confirm') });
          setIsOpen(false);
          router.push(closeHref);
        });
      }}
      user={null}
      users={users}
      openBadge={openBadge}
      translationNamespace={translationNamespace}
      isSubmitting={isPending}
      feedback={feedback}
    />
  );
}
