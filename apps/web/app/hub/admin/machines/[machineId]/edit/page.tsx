import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import { viewMachineDetails } from '@repo/application/machines/usecases';
import MachineEditFormClient from './machine-edit-form.client';

type AdminMachineEditPageProps = {
  params: Promise<{ machineId: string }>;
};

export default async function AdminMachineEditPage({
  params
}: AdminMachineEditPageProps): Promise<JSX.Element | null> {
  const t = await getTranslations('pages.hub.admin.machinesEdit');
  const { machineId } = await params;
  const machine = await viewMachineDetails(machineId);

  if (!machine) {
    return null;
  }

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <MachineEditFormClient machine={machine} />
    </>
  );
}
