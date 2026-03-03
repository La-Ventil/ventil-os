'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { openBadgeCreateRequestSchema, type OpenBadgeCreateRequest } from '@repo/application/forms';
import OpenBadgeForm from '@repo/ui/forms/open-badge.form';
import { createFormState } from '@repo/form/form-state';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createOpenBadgeAction } from '../../../../../lib/actions/create-open-badge';

const openBadgeCreateInitialState = createFormState<OpenBadgeCreateRequest>({
  name: '',
  description: '',
  imageFile: undefined,
  levels: [
    {
      title: '',
      description: ''
    }
  ],
  deliveryEnabled: true,
  deliveryLevel: 'level-1',
  activationEnabled: true
});

export default function OpenBadgeCreateFormClient() {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const formState = useFormActionState({
    action: createOpenBadgeAction,
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

  return <OpenBadgeForm formState={formState} />;
}
