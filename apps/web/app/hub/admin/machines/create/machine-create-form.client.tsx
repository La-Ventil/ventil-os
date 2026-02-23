'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { machineCreateRequestSchema } from '@repo/application/forms';
import MachineCreateForm, { machineCreateInitialState } from '@repo/ui/forms/machine-create.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { useTranslations } from 'next-intl';
import { createMachineAction } from '../../../../../lib/actions/create-machine';

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

  return <MachineCreateForm formState={formState} />;
}
