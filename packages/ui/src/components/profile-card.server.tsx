import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { UserProfile } from '@repo/application/users/models/user-profile';
import UserAvatar from './user-avatar.server';
import styles from './profile-card.module.css';

export type ProfileCardServerProps = {
  profile: UserProfile;
  avatarHref?: string;
  avatarLinkLabel?: string;
  avatarAlt: string;
};

export default function ProfileCardServer({ profile, avatarHref, avatarLinkLabel, avatarAlt }: ProfileCardServerProps) {
  const avatarContent = (
    <div className={styles.imageWrapper}>
      <UserAvatar user={profile} alt={avatarAlt} size={104} />
    </div>
  );

  return (
    <Card className={styles.card}>
      <CardMedia className={styles.media} title={profile.email}>
        {avatarHref ? (
          <Link href={avatarHref} aria-label={avatarLinkLabel} className={styles.avatarLink}>
            {avatarContent}
          </Link>
        ) : (
          avatarContent
        )}
      </CardMedia>
      <div className={styles.column}>
        <CardContent className={styles.content}>
          <Typography component="div" variant="h4">
            {profile.fullName}
          </Typography>
          <Typography className={styles.secondaryText} variant="subtitle1" component="div">
            {profile.username}
          </Typography>
          <Chip className={styles.profile} label={profile.profile} />
        </CardContent>
      </div>
    </Card>
  );
}
