import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import MachineCreateFormClient from './machine-create-form.client';

export default async function AdminMachineCreatePage() {
  const t = await getTranslations('pages.hub.admin.machinesCreate');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <MachineCreateFormClient />
    </>
  );
}
