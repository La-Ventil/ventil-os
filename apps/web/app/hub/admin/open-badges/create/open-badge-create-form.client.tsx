'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OpenBadgeCreateFormInput } from '@repo/application/forms';
import OpenBadgeCreateForm from '@repo/ui/forms/open-badge-create.form';
import { useFormActionStateWithValues } from '@repo/ui/hooks';
import { createOpenBadge } from '../../../../../lib/actions/create-open-badge';

export default function OpenBadgeCreateFormClient() {
  const router = useRouter();
  const actionState = useFormActionStateWithValues<OpenBadgeCreateFormInput>(createOpenBadge, {
    message: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
      imageUrl: '',
      levelTitle: '',
      levelDescription: '',
      deliveryEnabled: true,
      deliveryLevel: 'level-1',
      activationEnabled: true
    },
    isValid: undefined
  });

  const [state] = actionState;

  useEffect(() => {
    if (state.isValid) {
      router.push('/hub/admin/open-badges');
    }
  }, [router, state.isValid]);

  return <OpenBadgeCreateForm actionState={actionState} />;
}
