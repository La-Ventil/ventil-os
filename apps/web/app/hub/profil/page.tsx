import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { EventIcon } from '@repo/ui/icons/event-icon';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import { getProfilUtilisateurFromSession } from '../../../lib/auth';

const ProfileCard = styled(Card)`
  display: flex;
`;

const ProfileCardMedia = styled(CardMedia)`
  width: 104px;
`;

const ProfileCardColumn = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const ProfileCardContent = styled(CardContent)`
  flex: 1 0 auto;
`;

const ProfileImageWrapper = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SecondaryText = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.text.secondary};
`
);

const StatsList = styled(List)(
  ({ theme }) => `
  width: 100%;
  max-width: 360px;
  background-color: ${theme.palette.background.paper};
`
);

export default async function Page() {
  const profilUtilisateur = await getProfilUtilisateurFromSession();
  const t = await getTranslations('pages.hub.profile');
  return (
    <Stack spacing={2}>
      <Typography variant="h2">{profilUtilisateur.pseudo}</Typography>
      <Typography variant="h3">{t('subtitle')}</Typography>
      <Typography variant="body1">{t('intro')}</Typography>
      <ProfileCard>
        <ProfileCardMedia title={profilUtilisateur.email}>
          <ProfileImageWrapper>
            <Image src="/avatar.svg" alt={profilUtilisateur.email} layout="fill" objectFit="contain" />
          </ProfileImageWrapper>
        </ProfileCardMedia>
        <ProfileCardColumn>
          <ProfileCardContent>
            <Typography component="div" variant="h5">
              {profilUtilisateur.prenom} {profilUtilisateur.nom}
            </Typography>
            <SecondaryText variant="subtitle1" component="div">
              {profilUtilisateur.pseudo}
            </SecondaryText>
            <Chip label={profilUtilisateur.profil} />
          </ProfileCardContent>
        </ProfileCardColumn>
      </ProfileCard>
      <StatsList>
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
      </StatsList>
    </Stack>
  );  
}
