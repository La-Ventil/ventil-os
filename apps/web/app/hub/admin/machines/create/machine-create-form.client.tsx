'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { machineCreateRequestSchema, type MachineCreateFormInput } from '@repo/application/forms';
import MachineForm from '@repo/ui/forms/machine.form';
import { createFormState } from '@repo/form/form-state';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { useTranslations } from 'next-intl';
import type { OpenBadgeRequirementOptionViewModel } from '@repo/application/view-models/open-badge-requirement-option';
import { createMachineAction } from '../../../../../lib/actions/machines/create-machine';

const machineCreateInitialState = createFormState<MachineCreateFormInput>({
  name: '',
  description: '',
  imageFile: undefined,
  badgeRequired: false,
  requiredOpenBadgeId: '',
  requiredOpenBadgeLevelId: '',
  activationEnabled: true
});

type MachineCreateFormClientProps = {
  openBadgeOptions: OpenBadgeRequirementOptionViewModel[];
};

export default function MachineCreateFormClient({ openBadgeOptions }: MachineCreateFormClientProps) {
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

  return <MachineForm formState={formState} openBadgeOptions={openBadgeOptions} />;
}
