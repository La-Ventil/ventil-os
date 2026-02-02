'use client';
import type { JSX } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import LevelChip from './level-chip';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import Section from './section';
import SectionSubtitle from './section-subtitle';
import SectionTitle from './section-title';
import { getThemeSectionClassName, ThemeSection } from '../theme';
import styles from './open-badge-modal.module.css';

export type OpenBadgeModalProps = {
  openBadge: OpenBadgeViewModel | null;
  open: boolean;
  onClose: () => void;
};

export default function OpenBadgeModal({ openBadge, open, onClose }: OpenBadgeModalProps): JSX.Element | null {
  const t = useTranslations('pages.hub.openBadges');
  if (!openBadge) {
    return null;
  }
  const { levels } = openBadge;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      slotProps={{
        paper: {
          className: `${styles.modal} ${getThemeSectionClassName(ThemeSection.OpenBadge)}`
        }
      }}
    >
      <IconButton aria-label={t('detailsModal.closeLabel')} onClick={onClose} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
      <SectionTitle icon={<OpenBadgeIcon color="secondary" />}>{openBadge.name}</SectionTitle>
      <DialogContent className={styles.modalContent}>
        <Section>
          <div className={styles.modalIllustration}>
            {openBadge.coverImage ? (
              <img src={openBadge.coverImage} alt={openBadge.name} className={styles.modalIllustration} />
            ) : (
              t('detailsModal.illustrationPlaceholder')
            )}
          </div>
          <SectionSubtitle className={styles.sectionSubtitle}>{t('detailsModal.sectionSubtitle')}</SectionSubtitle>

          <Typography variant="body1">{openBadge.description}</Typography>
        </Section>

        <Section className={styles.modalActions} p={0}>
          <Button variant="contained" size="large" fullWidth>
            {t('detailsModal.actions.assign')}
          </Button>
          <Button variant="contained" size="large" fullWidth>
            {t('detailsModal.actions.download')}
          </Button>
        </Section>

        <Section className={styles.levelList}>
          {levels.map((level) => (
            <Accordion
              key={`${openBadge.id}-detail-${level.level}`}
              defaultExpanded={level.level === openBadge.activeLevel}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <LevelChip
                  level={level.level}
                  isActive={level.level === openBadge.activeLevel}
                  className={styles.levelChip}
                />
                <Typography variant="subtitle2" className={styles.levelTitle}>
                  {level.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {level.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Section>
      </DialogContent>
    </Dialog>
  );
}
