import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Link from '@repo/ui/link';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('pages.hub.settings');

  return (
    <Stack spacing={2}>
      <Typography variant="h2">{t('title')}</Typography>
      <Typography variant="h3">{t('subtitle')}</Typography>
      <Typography variant="body1">{t('intro')}</Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
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
      </List>
    </Stack>
  );
}
