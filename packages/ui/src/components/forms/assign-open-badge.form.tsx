'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import styles from './assign-open-badge.form.module.css';

type AssignOpenBadgeFormProps = {
  user: { id: string; firstName: string; lastName?: string } | null;
  users: Array<{ id: string; label: string }>;
  openBadge: OpenBadgeViewModel;
  translationNamespace?: string;
  isSubmitting?: boolean;
  userSelectionDisabled?: boolean;
  onConfirm: (payload: { userId: string; openBadgeId: string; level: number }) => void;
  onCancel: () => void;
  feedback?: { type: 'error' | 'success'; message: string } | null;
};

export default function AssignOpenBadgeForm({
  user,
  users,
  openBadge,
  translationNamespace = 'pages.hub.admin.users.assignModal',
  isSubmitting = false,
  userSelectionDisabled,
  onConfirm,
  onCancel,
  feedback = null
}: AssignOpenBadgeFormProps) {
  const t = useTranslations(translationNamespace);
  const levelOptions = openBadge.levels ?? [];
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0] ? String(levelOptions[0].level) : '');

  const userOptions = useMemo(() => users, [users]);
  const [selectedUserId, setSelectedUserId] = useState(user?.id ?? users[0]?.id ?? '');
  const isUserSelectionDisabled = userSelectionDisabled ?? Boolean(user);
  const canSubmit = Boolean(selectedLevel && selectedUserId);

  useEffect(() => {
    setSelectedUserId(user?.id ?? users[0]?.id ?? '');
  }, [user, users]);

  const handleAssign = () => {
    if (!canSubmit) {
      return;
    }

    const level = Number.parseInt(selectedLevel, 10);

    if (Number.isNaN(level)) {
      return;
    }

    onConfirm({
      userId: selectedUserId,
      openBadgeId: openBadge.id,
      level
    });
  };

  return (
    <>
      {feedback ? (
        <Alert severity={feedback.type} className={styles.feedback}>
          {feedback.message}
        </Alert>
      ) : null}
      <SectionTitle>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">
          {user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : t('userLabel')}
        </Typography>
      </Section>

      <Section className={styles.formSection}>
        <div className={styles.illustration}>
          {openBadge.coverImage ? (
            <Image
              src={openBadge.coverImage}
              alt={openBadge.name}
              fill
              sizes="120px"
              className={styles.illustrationImage}
            />
          ) : (
            t('illustrationPlaceholder')
          )}
        </div>
        <div className={styles.fields}>
          <FormControl fullWidth>
            <InputLabel id="assign-open-badge-level-label">{t('levelLabel')}</InputLabel>
            <Select
              labelId="assign-open-badge-level-label"
              label={t('levelLabel')}
              value={selectedLevel}
              disabled={isSubmitting}
              onChange={(event) => setSelectedLevel(event.target.value)}
            >
              {levelOptions.map((level) => (
                <MenuItem key={`${openBadge.id}-${level.level}`} value={String(level.level)}>
                  {level.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="assign-open-badge-user-label">{t('userLabel')}</InputLabel>
            <Select
              labelId="assign-open-badge-user-label"
              label={t('userLabel')}
              value={selectedUserId}
              disabled={isUserSelectionDisabled}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {userOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Section>

      <Section className={styles.actions}>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button variant="contained" fullWidth onClick={handleAssign} disabled={!canSubmit || isSubmitting}>
          {t('confirm')}
        </Button>
      </Section>
    </>
  );
}
