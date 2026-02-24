'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  machineUpdateRequestSchema,
  type MachineUpdateRequest
} from '@repo/application/forms';
import MachineCreateForm from '@repo/ui/forms/machine-create.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import { MachineAdminStatus } from '@repo/view-models/machine-admin';
import { updateMachineAction } from '../../../../../../lib/actions/update-machine';

type MachineEditFormClientProps = {
  machine: MachineDetailsViewModel;
};

export default function MachineEditFormClient({ machine }: MachineEditFormClientProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();

  const initialState = createFormState<MachineUpdateRequest>({
    id: machine.id,
    name: machine.name,
    description: machine.description ?? '',
    imageFile: undefined,
    badgeRequired: machine.badgeRequirements.length > 0,
    badgeQuery: '',
    activationEnabled: machine.status === MachineAdminStatus.Active
  });

  const formState = useFormActionState({
    action: updateMachineAction,
    initialState,
    schema: machineUpdateRequestSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const [state] = formState;

  useEffect(() => {
    if (state.success) {
      router.push('/hub/admin/machines');
    }
  }, [router, state.success]);

  return (
    <MachineCreateForm
      formState={formState}
      imagePreviewUrl={machine.imageUrl ?? undefined}
      imageRequired={false}
      submitLabel={tRoot('pages.hub.admin.machinesEdit.actions.save')}
    />
  );
}
