'use client';

import Image from 'next/image';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { ProfilUtilisateur } from '@repo/domain/profil-utilisateur';
import styles from './profile-card.module.css';

export type ProfileCardProps = {
  profilUtilisateur: ProfilUtilisateur;
  imageSrc?: string;
};

export default function ProfileCard({ profilUtilisateur, imageSrc = '/avatar.svg' }: ProfileCardProps) {
  const fullName = [profilUtilisateur.prenom, profilUtilisateur.nom].filter(Boolean).join(' ');

  return (
    <Card className={styles.card}>
      <CardMedia className={styles.media} title={profilUtilisateur.email}>
        <div className={styles.imageWrapper}>
          <Image src={imageSrc} alt={profilUtilisateur.email} layout="fill" objectFit="contain" />
        </div>
      </CardMedia>
      <div className={styles.column}>
        <CardContent className={styles.content}>
          <Typography component="div" variant="h5">
            {fullName}
          </Typography>
          <Typography className={styles.secondaryText} variant="subtitle1" component="div">
            {profilUtilisateur.pseudo}
          </Typography>
          <Chip label={profilUtilisateur.profil} />
        </CardContent>
      </div>
    </Card>
  );
}
