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
      <UserAvatar user={profile} alt={avatarAlt} size={120} />
    </div>
  );

  return (
    <Card className={styles.card}>
      <div className={styles.topCard}>
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
            <div className={styles.chipGroup}>
              <Chip className={styles.chipProfile} label={profile.profile} />
              <div className={styles.chipLevel}>
                NIVEAU <span>01</span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
      <div className={styles.logoGroup}>
        <div className={styles.logo}>
          <svg aria-hidden="true" viewBox="0 0 50 75" xmlns="http://www.w3.org/2000/svg">
            <polygon fill="#317bf4" points="0 0 0 75 10.1 75 10 49 25 64 40 49 39.9 75 50 75 50 0 0 0"></polygon>
          </svg>
        </div>
        <div className={styles.logoTitle}>La-Ventil</div>
        <div className={styles.logoID}>ID {profile.id}</div>
      </div>
    </Card>
  );
}
