'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import OpenBadgeModal from '@repo/ui/open-badge/open-badge-modal';
import { assignOpenBadge } from '../../../lib/actions/assign-open-badge';
import { fieldErrorsToSingleMessage } from '../../../lib/validation';

type OpenBadgeModalRouteClientProps = {
  openBadge: OpenBadgeViewModel | null;
  closeHref: string;
  canAssign: boolean;
  users: Array<{ id: string; label: string }>;
};

export default function OpenBadgeModalRouteClient({
  openBadge,
  closeHref,
  canAssign,
  users
}: OpenBadgeModalRouteClientProps): JSX.Element | null {
  const router = useRouter();
  const t = useTranslations('pages.hub.openBadges.assignModal');
  const [isOpen, setIsOpen] = useState(Boolean(openBadge));
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    setIsOpen(Boolean(openBadge));
  }, [openBadge]);

  if (!openBadge) {
    return null;
  }

  const allowAssign = canAssign && users.length > 0;

  return (
    <>
      <OpenBadgeModal
        openBadge={openBadge}
        open={isOpen}
        onAssign={
          allowAssign
            ? () => {
                setIsAssignOpen(true);
                setIsOpen(false);
              }
            : undefined
        }
        onClose={() => {
          setIsOpen(false);
          router.push(closeHref);
        }}
      />
      {allowAssign ? (
        <AssignOpenBadgeModal
          open={isAssignOpen}
          onClose={() => {
            setIsAssignOpen(false);
            setFeedback(null);
            setIsOpen(true);
          }}
          user={null}
          users={users}
          openBadge={openBadge}
          translationNamespace="pages.hub.openBadges.assignModal"
          isSubmitting={isPending}
          feedback={feedback}
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
              setIsAssignOpen(false);
            });
          }}
        />
      ) : null}
    </>
  );
}
