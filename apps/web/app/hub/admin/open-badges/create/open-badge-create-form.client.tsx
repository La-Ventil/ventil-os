'use client';

import { OpenBadgeCreateFormInput } from '@repo/application/forms';
import OpenBadgeCreateForm from '@repo/ui/forms/open-badge-create.form';
import { useFormActionStateWithValues } from '@repo/ui/hooks';
import { createOpenBadge } from '../../../../../lib/actions/create-open-badge';

export default function OpenBadgeCreateFormClient() {
  const actionState = useFormActionStateWithValues<OpenBadgeCreateFormInput>(
    createOpenBadge,
    {
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
    }
  );

  return <OpenBadgeCreateForm actionState={actionState} />;
}
