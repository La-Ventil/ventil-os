'use client';

import type { JSX } from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import AssignOpenBadgeModal from '@repo/ui/admin/assign-open-badge-modal';
import OpenBadgeModal from '@repo/ui/open-badge/open-badge-modal';
import { assignOpenBadgeAction } from '../../../lib/actions/assign-open-badge';
import { useDelayedAction } from '@repo/ui/hooks/use-delayed-action';

type OpenBadgeModalRouteClientProps = {
  openBadge: OpenBadgeViewModel | null;
  closeHref: string;
  canAssign: boolean;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
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
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const { schedule, cancel } = useDelayedAction();

  const handleAssignClose = () => {
    cancel();
    setIsAssignOpen(false);
    setFeedback(null);
    router.push(closeHref);
  };

  useEffect(() => {
    setIsOpen(Boolean(openBadge));
  }, [openBadge]);

  useEffect(() => {
    if (isAssignOpen) {
      cancel();
      setFeedback(null);
    }
  }, [isAssignOpen, cancel]);

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
                setFeedback(null);
                cancel();
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
          onClose={handleAssignClose}
          user={null}
          users={users}
          openBadges={[openBadge]}
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
