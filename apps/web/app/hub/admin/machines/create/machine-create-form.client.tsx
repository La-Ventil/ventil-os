'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { machineCreateRequestSchema, type MachineCreateFormInput } from '@repo/application/forms';
import MachineForm from '@repo/ui/forms/machine.form';
import { createFormState } from '@repo/form/form-state';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { useTranslations } from 'next-intl';
import { createMachineAction } from '../../../../../lib/actions/create-machine';

const machineCreateInitialState = createFormState<MachineCreateFormInput>({
  name: '',
  description: '',
  imageFile: undefined,
  badgeRequired: true,
  badgeQuery: '',
  activationEnabled: true
});

export default function MachineCreateFormClient() {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const formState = useFormActionState({
    action: createMachineAction,
    initialState: machineCreateInitialState,
    schema: machineCreateRequestSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const [state] = formState;

  useEffect(() => {
    if (state.success) {
      router.push('/hub/admin/machines');
    }
  }, [router, state.success]);

  return <MachineForm formState={formState} />;
}
