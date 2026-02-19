import { getTranslations } from 'next-intl/server';
import PrivacyPolicyContent from '@repo/ui/privacy-policy-content';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('pages.public.privacyPolicy');

  return <PrivacyPolicyContent t={t} />;
}
