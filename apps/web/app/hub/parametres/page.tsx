import { getTranslations } from 'next-intl/server';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import List, { ListProps } from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Link from '@repo/ui/link';

const SettingsList = styled(List)<ListProps>(
  ({ theme }) => `
  width: 100%;
  max-width: 360px;
  background-color: ${theme.palette.background.paper};
`
);

export default async function Page() {
  const t = await getTranslations('pages.hub.settings');

  return (
    <Stack spacing={2}>
      <Typography variant="h2">{t('title')}</Typography>
      <Typography variant="h3">{t('subtitle')}</Typography>
      <Typography variant="body1">{t('intro')}</Typography>
      <SettingsList component="nav">
        <ListItemButton component={Link} href="/hub/parametres/profil">
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary={t('profileLink')} />
        </ListItemButton>
        <ListItemButton component={Link} href="/hub/parametres/avatar">
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={t('avatarLink')} />
        </ListItemButton>
      </SettingsList>
    </Stack>
  );
}
