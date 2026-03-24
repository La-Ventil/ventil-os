'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { UserProfile } from '@repo/application/users/models/user-profile';
import Link from './link';
import UserAvatar from './user-avatar';
import styles from './profile-card.module.css';

export type ProfileCardProps = {
  profile: UserProfile;
  avatarHref?: string;
  avatarLinkLabel?: string;
};

export default function ProfileCard({ profile, avatarHref, avatarLinkLabel }: ProfileCardProps) {
  const avatarContent = (
    <div className={styles.imageWrapper}>
      <UserAvatar user={profile} fill />
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
