'use client';

import { useTransition } from 'react';
import { MachineAdminStatus, type MachineAdminViewModel } from '@repo/view-models/machine-admin';
import { setMachineStatusAction } from '../../../../lib/actions/set-machine-status';
import RowQuickActionsMenu from '../row-quick-actions-menu';

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
      machine.status === MachineAdminStatus.Active
        ? MachineAdminStatus.Inactive
        : MachineAdminStatus.Active;

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
