import { getTranslations } from 'next-intl/server';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@repo/ui/link';
import SectionTitle from '@repo/ui/section-title';
import SettingsList, { SettingsListItem } from '@repo/ui/settings-list';

export default async function Page() {
  const t = await getTranslations('pages.hub.settings');

  return (
    <Stack spacing={2}>
      <SectionTitle>{t('title')}</SectionTitle>
      <Typography variant="h3">{t('subtitle')}</Typography>
      <Typography variant="body1">{t('intro')}</Typography>
      <SettingsList>
        <SettingsListItem icon={<SendIcon />} label={t('profileLink')} href="/hub/parametres/profil" linkComponent={Link} />
        <SettingsListItem icon={<DraftsIcon />} label={t('avatarLink')} href="/hub/parametres/avatar" linkComponent={Link} />
      </SettingsList>
    </Stack>
  );
}
