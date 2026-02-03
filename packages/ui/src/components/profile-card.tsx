'use client';

import Image from 'next/image';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { UserProfile } from '@repo/view-models/user-profile';
import UserAvatar from './user-avatar';
import styles from './profile-card.module.css';

export type ProfileCardProps = {
  profile: UserProfile;
};

export default function ProfileCard({ profile }: ProfileCardProps) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  return (
    <Card className={styles.card}>
      <CardMedia className={styles.media} title={profile.email}>
        <div className={styles.imageWrapper}>
          <UserAvatar user={profile} fill />
        </div>
      </CardMedia>
      <div className={styles.column}>
        <CardContent className={styles.content}>
          <Typography component="div" variant="h4">
            {fullName}
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
