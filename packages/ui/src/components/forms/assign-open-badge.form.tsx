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
import type { FormFeedback } from '@repo/form/form-feedback';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import { formatOpenBadgeLevelLabel } from '@repo/domain/badge/open-badge-level';
import { OpenBadge } from '@repo/domain/badge/open-badge';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import UserAutocomplete from '../inputs/user-autocomplete';
import styles from './assign-open-badge.form.module.css';

type AssignOpenBadgeFormProps = {
  user: UserSummaryWithOpenBadgeLevelViewModel | null;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  openBadges: OpenBadgeViewModel[];
  translationNamespace: string;
  isSubmitting?: boolean;
  userSelectionDisabled?: boolean;
  titleId?: string;
  descriptionId?: string;
  onConfirm: (payload: { userId: string; openBadgeId: string; level: number }) => void;
  onCancel: () => void;
  feedback?: FormFeedback | null;
};

export default function AssignOpenBadgeForm({
  user,
  users,
  openBadges,
  translationNamespace,
  isSubmitting = false,
  userSelectionDisabled,
  titleId,
  descriptionId,
  onConfirm,
  onCancel,
  feedback = null
}: AssignOpenBadgeFormProps) {
  const t = useTranslations(translationNamespace);
  const isUserSelectionDisabled = userSelectionDisabled ?? Boolean(user);
  const [selectedOpenBadgeId, setSelectedOpenBadgeId] = useState(openBadges[0]?.id ?? '');
  const selectedOpenBadge = useMemo(
    () => openBadges.find((badge) => badge.id === selectedOpenBadgeId) ?? openBadges[0] ?? null,
    [openBadges, selectedOpenBadgeId]
  );
  const levelOptions = selectedOpenBadge?.levels ?? [];
  const assignableLevelOptions = useMemo(() => {
    if (!selectedOpenBadge) {
      return [];
    }

    if (!isUserSelectionDisabled) {
      return levelOptions;
    }

    return levelOptions.filter((level) => level.level > selectedOpenBadge.activeLevel);
  }, [isUserSelectionDisabled, levelOptions, selectedOpenBadge]);
  const [selectedLevel, setSelectedLevel] = useState(
    assignableLevelOptions[0] ? String(assignableLevelOptions[0].level) : ''
  );
  const selectedLevelNumber = Number.parseInt(selectedLevel, 10);
  const userOptions = useMemo(() => {
    if (isUserSelectionDisabled || Number.isNaN(selectedLevelNumber)) {
      return users;
    }

    return users.filter((option) => (option.currentOpenBadgeLevel ?? 0) < selectedLevelNumber);
  }, [isUserSelectionDisabled, selectedLevelNumber, users]);
  const [selectedUserId, setSelectedUserId] = useState(user?.id ?? '');
  const canSubmit = Boolean(selectedOpenBadge && selectedLevel && selectedUserId);
  const selectedUser = useMemo(
    () => userOptions.find((option) => option.id === selectedUserId) ?? null,
    [selectedUserId, userOptions]
  );

  useEffect(() => {
    if (!selectedOpenBadge) {
      setSelectedOpenBadgeId('');
      setSelectedLevel('');
      return;
    }

    if (selectedOpenBadge.id !== selectedOpenBadgeId) {
      setSelectedOpenBadgeId(selectedOpenBadge.id);
    }
  }, [selectedOpenBadge, selectedOpenBadgeId]);

  useEffect(() => {
    if (assignableLevelOptions.some((level) => String(level.level) === selectedLevel)) {
      return;
    }

    setSelectedLevel(assignableLevelOptions[0] ? String(assignableLevelOptions[0].level) : '');
  }, [assignableLevelOptions, selectedLevel]);

  useEffect(() => {
    setSelectedUserId(user?.id ?? '');
  }, [user, users]);

  useEffect(() => {
    if (isUserSelectionDisabled || !selectedUserId) {
      return;
    }

    if (!userOptions.some((option) => option.id === selectedUserId)) {
      setSelectedUserId('');
    }
  }, [isUserSelectionDisabled, selectedUserId, userOptions]);

  const handleAssign = () => {
    if (!canSubmit) {
      return;
    }

    if (!selectedOpenBadge) {
      return;
    }

    if (Number.isNaN(selectedLevelNumber)) {
      return;
    }

    onConfirm({
      userId: selectedUserId,
      openBadgeId: selectedOpenBadge.id,
      level: selectedLevelNumber
    });
  };

  if (!selectedOpenBadge) {
    return null;
  }

  return (
    <>
      <SectionTitle id={titleId}>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle id={descriptionId}>{t('subtitle')}</SectionSubtitle>
        {feedback ? (
          <Alert severity={feedback.type} className={styles.feedback}>
            {feedback.message}
          </Alert>
        ) : null}
        <Typography variant="body1">{user ? user.fullName : t('userLabel')}</Typography>
      </Section>

      <Section className={styles.formSection}>
        <div className={styles.illustration}>
          {selectedOpenBadge.coverImage ? (
            <Image
              src={selectedOpenBadge.coverImage}
              alt={selectedOpenBadge.name}
              fill
              sizes="120px"
              className={styles.illustrationImage}
            />
          ) : (
            t('illustrationPlaceholder')
          )}
        </div>
        <div className={styles.fields}>
          {openBadges.length > 1 ? (
            <FormControl fullWidth>
              <InputLabel id="assign-open-badge-badge-label">{t('badgeLabel')}</InputLabel>
              <Select
                labelId="assign-open-badge-badge-label"
                label={t('badgeLabel')}
                value={selectedOpenBadge.id}
                disabled={isSubmitting}
                onChange={(event) => setSelectedOpenBadgeId(event.target.value)}
              >
                {openBadges.map((badge) => (
                  <MenuItem key={badge.id} value={badge.id}>
                    {formatAssignableOpenBadgeLabel(badge)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          <FormControl fullWidth>
            <InputLabel id="assign-open-badge-level-label">{t('levelLabel')}</InputLabel>
            <Select
              labelId="assign-open-badge-level-label"
              label={t('levelLabel')}
              value={selectedLevel}
              disabled={isSubmitting}
              onChange={(event) => setSelectedLevel(event.target.value)}
            >
              {assignableLevelOptions.map((level) => (
                <MenuItem key={`${selectedOpenBadge.id}-${level.level}`} value={String(level.level)}>
                  {formatOpenBadgeLevelLabel(level)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <UserAutocomplete<false>
            label={t('userLabel')}
            placeholder={t('userSearchPlaceholder')}
            options={userOptions}
            value={selectedUser}
            onChange={(nextValue) => setSelectedUserId(nextValue?.id ?? '')}
            multiple={false}
            disabled={isUserSelectionDisabled}
          />
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

const formatAssignableOpenBadgeLabel = (badge: OpenBadgeViewModel): string => {
  const activeLevel = OpenBadge.getActiveLevel(badge);

  if (!activeLevel) {
    return badge.name;
  }

  return `${badge.name} (${formatOpenBadgeLevelLabel(activeLevel)})`;
};
