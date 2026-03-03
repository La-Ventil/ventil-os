'use client';

import { useTransition } from 'react';
import { MachineAdminStatus, type MachineAdminViewModel } from '@repo/view-models/machine-admin';
import RowQuickActionsMenu from '@repo/ui/admin/row-quick-actions-menu';
import { setMachineStatusAction } from '../../../../lib/actions/machines/set-machine-status';

type MachineQuickActionsProps = {
  machine: MachineAdminViewModel;
  labels: {
    manage: string;
    edit: string;
    activate: string;
    deactivate: string;
  };
};

export default function MachineQuickActions({ machine, labels }: MachineQuickActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    const nextStatus =
      machine.status === MachineAdminStatus.Active ? MachineAdminStatus.Inactive : MachineAdminStatus.Active;

    startTransition(async () => {
      const formData = new FormData();
      formData.set('machineId', machine.id);
      formData.set('nextStatus', nextStatus);
      await setMachineStatusAction(formData);
    });
  };

  return (
    <RowQuickActionsMenu
      label={labels.manage}
      disabled={isPending}
      items={[
        { label: labels.edit, href: `/hub/admin/machines/${machine.id}/edit` },
        {
          label: machine.status === MachineAdminStatus.Active ? labels.deactivate : labels.activate,
          onClick: handleToggleStatus
        }
      ]}
    />
  );
}
