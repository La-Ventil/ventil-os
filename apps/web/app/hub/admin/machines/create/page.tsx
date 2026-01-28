import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import MachineCreateForm from '@repo/ui/forms/machine-create.form';

export default async function AdminMachineCreatePage() {
  const t = await getTranslations('pages.hub.admin.machinesCreate');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <MachineCreateForm />
    </>
  );
}
