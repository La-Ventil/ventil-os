import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import { getProfilUtilisateurFromSession } from '../../../lib/auth';
import { EventIcon } from '@repo/ui/icons/event-icon';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const profilUtilisateur = await getProfilUtilisateurFromSession();
  const t = await getTranslations('pages.hub.profile');
  return (
    <Stack spacing={2}>
      <Typography variant="h2">{profilUtilisateur.pseudo}</Typography>
      <Typography variant="h3">{t('subtitle')}</Typography>
      <Typography variant="body1">{t('intro')}</Typography>
      <Card sx={{ display: 'flex' }}>
        <CardMedia title={profilUtilisateur.email} sx={{ width: 104 }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src="/avatar.svg" alt={profilUtilisateur.email} layout="fill" objectFit="contain" />
          </div>
        </CardMedia>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              {profilUtilisateur.prenom} {profilUtilisateur.nom}
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }}>
              {profilUtilisateur.pseudo}
            </Typography>
            <Chip label={profilUtilisateur.profil} />
          </CardContent>
        </Box>
      </Card>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EventIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t('stats.events')} secondary="00" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <OpenBadgeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t('stats.openBadge')} secondary="00" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <MachineIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t('stats.machine')} secondary="00" />
        </ListItem>
      </List>
    </Stack>
  );
}
