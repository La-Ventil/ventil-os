'use client';

import { MachineCreateFormInput } from '@repo/application/forms';
import MachineCreateForm from '@repo/ui/forms/machine-create.form';
import { useFormActionStateWithValues } from '@repo/ui/hooks';
import { createMachine } from '../../../../../lib/actions/create-machine';

export default function MachineCreateFormClient() {
  const actionState = useFormActionStateWithValues<MachineCreateFormInput>(
    createMachine,
    {
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
    }
  );

  return <MachineCreateForm actionState={actionState} />;
}
