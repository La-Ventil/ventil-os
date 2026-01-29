'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import { getThemeSectionClassName, ThemeSection } from '../../theme';
import styles from './assign-open-badge-dialog.module.css';

type AssignOpenBadgeDialogProps = {
  open: boolean;
  onClose: () => void;
  user: { id: string; firstName: string; lastName?: string } | null;
  users: Array<{ id: string; label: string }>;
  openBadges: OpenBadgeViewModel[];
  labels: {
    title: string;
    subtitle: string;
    badgeLabel: string;
    levelLabel: string;
    userLabel: string;
    cancel: string;
    confirm: string;
    illustrationPlaceholder: string;
    error: string;
  };
  isSubmitting?: boolean;
  onConfirm: (payload: { userId: string; openBadgeId: string; level: number }) => void;
  feedback?: { type: 'error' | 'success'; message: string } | null;
};

export default function AssignOpenBadgeDialog({
  open,
  onClose,
  user,
  users,
  openBadges,
  labels,
  isSubmitting = false,
  onConfirm,
  feedback = null
}: AssignOpenBadgeDialogProps) {
  const defaultBadgeId = openBadges[0]?.id ?? '';
  const [selectedBadgeId, setSelectedBadgeId] = useState(defaultBadgeId);
  const selectedBadge = openBadges.find((badge) => badge.id === selectedBadgeId) ?? openBadges[0];

  const levelOptions = selectedBadge?.levels ?? [];
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0] ? String(levelOptions[0].level) : '');

  const userOptions = useMemo(() => users, [users]);
  const selectedUserId = user?.id ?? users[0]?.id ?? '';
  const canSubmit = Boolean(selectedBadgeId && selectedLevel && selectedUserId);

  const handleBadgeChange = (badgeId: string) => {
    setSelectedBadgeId(badgeId);
    const badge = openBadges.find((item) => item.id === badgeId);
    const nextLevel = badge?.levels?.[0] ? String(badge.levels[0].level) : '';
    setSelectedLevel(nextLevel);
  };

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
      openBadgeId: selectedBadgeId,
      level
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          className: `${styles.modal} ${getThemeSectionClassName(ThemeSection.OpenBadge)}`
        }
      }}
    >
      <DialogContent className={styles.modalContent}>
        <IconButton aria-label={labels.cancel} onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
        {feedback ? (
          <Alert severity={feedback.type} className={styles.feedback}>
            {feedback.message}
          </Alert>
        ) : null}
        <SectionTitle>{labels.title}</SectionTitle>
        <Section>
          <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
          <Typography variant="body1">
            {user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : labels.userLabel}
          </Typography>
        </Section>

        <Section className={styles.formSection}>
          <div className={styles.illustration}>
            {selectedBadge?.coverImage ? (
              <Image
                src={selectedBadge.coverImage}
                alt={selectedBadge.name}
                fill
                sizes="120px"
                className={styles.illustrationImage}
              />
            ) : (
              labels.illustrationPlaceholder
            )}
          </div>
          <div className={styles.fields}>
            <FormControl fullWidth>
              <InputLabel id="assign-open-badge-select-label">{labels.badgeLabel}</InputLabel>
              <Select
                labelId="assign-open-badge-select-label"
                label={labels.badgeLabel}
                value={selectedBadgeId}
                disabled={isSubmitting}
                onChange={(event) => handleBadgeChange(event.target.value)}
              >
                {openBadges.map((badge) => (
                  <MenuItem key={badge.id} value={badge.id}>
                    {badge.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="assign-open-badge-level-label">{labels.levelLabel}</InputLabel>
              <Select
                labelId="assign-open-badge-level-label"
                label={labels.levelLabel}
                value={selectedLevel}
                disabled={isSubmitting}
                onChange={(event) => setSelectedLevel(event.target.value)}
              >
                {levelOptions.map((level) => (
                  <MenuItem key={`${selectedBadgeId}-${level.level}`} value={String(level.level)}>
                    {level.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="assign-open-badge-user-label">{labels.userLabel}</InputLabel>
              <Select labelId="assign-open-badge-user-label" label={labels.userLabel} value={selectedUserId} disabled>
                {userOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Section>

        <Section className={styles.actions} p={0}>
          <Button variant="outlined" fullWidth onClick={onClose}>
            {labels.cancel}
          </Button>
          <Button variant="contained" fullWidth onClick={handleAssign} disabled={!canSubmit || isSubmitting}>
            {labels.confirm}
          </Button>
        </Section>
      </DialogContent>
    </Dialog>
  );
}
