'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { machineUpdateRequestSchema, type MachineUpdateRequest } from '@repo/application/forms';
import MachineForm from '@repo/ui/forms/machine.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import type { MachineDetailsViewModel } from '@repo/application/view-models/machine-details';
import { MachineAdminStatus } from '@repo/application/view-models/machine-admin';
import type { OpenBadgeRequirementOptionViewModel } from '@repo/application/view-models/open-badge-requirement-option';
import { updateMachineAction } from '../../../../../../lib/actions/machines/update-machine';

type MachineEditFormClientProps = {
  machine: MachineDetailsViewModel;
  openBadgeOptions: OpenBadgeRequirementOptionViewModel[];
};

export default function MachineEditFormClient({ machine, openBadgeOptions }: MachineEditFormClientProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();

  const initialState = createFormState<MachineUpdateRequest>({
    id: machine.id,
    name: machine.name,
    description: machine.description ?? '',
    imageFile: undefined,
    badgeRequired: machine.badgeRequirements.length > 0,
    requiredOpenBadgeId: machine.badgeRequirements[0]?.openBadge.id ?? '',
    requiredOpenBadgeLevelId: machine.badgeRequirements[0]?.level?.id ?? '',
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
    <MachineForm
      formState={formState}
      openBadgeOptions={openBadgeOptions}
      imagePreviewUrl={machine.imageUrl ?? undefined}
      imageRequired={false}
      submitLabel={tRoot('pages.hub.admin.machinesEdit.actions.save')}
    />
  );
}
