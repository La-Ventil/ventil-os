import { getTranslations } from 'next-intl/server';
import ScopedIntlClientProvider from '../../../../i18n/scoped-intl-client-provider';
import UpdatePasswordPageClient from './_components/update-password-page.client';

type UpdatePasswordPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function Page({ params }: UpdatePasswordPageProps) {
  const [{ token }, t, tCommon, tForms] = await Promise.all([
    params,
    getTranslations('pages.public.updatePassword'),
    getTranslations('common'),
    getTranslations('forms')
  ]);

  return (
    <ScopedIntlClientProvider paths={['forms']}>
      <UpdatePasswordPageClient
        token={token}
        title={t('title')}
        intro={t('intro')}
        backLabel={tCommon('actions.back')}
        submitLabel={tForms('actions.submitUpdatePassword')}
      />
    </ScopedIntlClientProvider>
  );
}
