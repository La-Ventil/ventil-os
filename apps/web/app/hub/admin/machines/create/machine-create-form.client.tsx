'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MachineCreateFormInput } from '@repo/application/forms';
import MachineCreateForm from '@repo/ui/forms/machine-create.form';
import { useFormActionStateWithValues } from '@repo/ui/hooks';
import { createMachine } from '../../../../../lib/actions/create-machine';

export default function MachineCreateFormClient() {
  const router = useRouter();
  const actionState = useFormActionStateWithValues<MachineCreateFormInput>(createMachine, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
      imageUrl: '',
      badgeRequired: true,
      badgeQuery: '',
      activationEnabled: true
    },
    isValid: undefined
  });

  const [state] = actionState;

  useEffect(() => {
    if (state.success) {
      router.push('/hub/admin/machines');
    }
  }, [router, state.success]);

  return <MachineCreateForm actionState={actionState} />;
}
