'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { openBadgeCreateRequestSchema } from '@repo/application/forms';
import OpenBadgeCreateForm, { openBadgeCreateInitialState } from '@repo/ui/forms/open-badge-create.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createOpenBadge } from '../../../../../lib/actions/create-open-badge';

export default function OpenBadgeCreateFormClient() {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const formState = useFormActionState({
    action: createOpenBadge,
    initialState: openBadgeCreateInitialState,
    schema: openBadgeCreateRequestSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const [state] = formState;

  useEffect(() => {
    if (state.success) {
      router.push('/hub/admin/open-badges');
    }
  }, [router, state.success]);

  return <OpenBadgeCreateForm formState={formState} />;
}
