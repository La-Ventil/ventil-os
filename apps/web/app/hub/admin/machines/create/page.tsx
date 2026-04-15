import { getTranslations } from 'next-intl/server';
import { browseOpenBadgeRequirementOptions } from '@repo/application/open-badges/usecases';
import SectionTitle from '@repo/ui/section-title.server';
import MachineCreateFormClient from './_components/machine-create-form.client';

export default async function AdminMachineCreatePage() {
  const t = await getTranslations('pages.hub.admin.machinesCreate');
  const openBadgeOptions = await browseOpenBadgeRequirementOptions();

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <MachineCreateFormClient openBadgeOptions={openBadgeOptions} />
    </>
  );
}
