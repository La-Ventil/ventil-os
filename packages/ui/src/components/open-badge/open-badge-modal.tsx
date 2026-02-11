'use client';
import type { JSX } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { OpenBadgeIcon } from '../icons/open-badge-icon';
import LevelChip from '../level-chip';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import ModalLayout from '../modal-layout';
import ModalIllustration from '../modal-illustration';
import { ThemeSection } from '../../theme';
import styles from './open-badge-modal.module.css';

export type OpenBadgeModalProps = {
  openBadge: OpenBadgeViewModel | null;
  open: boolean;
  onClose: () => void;
  onAssign?: () => void;
};

export default function OpenBadgeModal({
  openBadge,
  open,
  onClose,
  onAssign
}: OpenBadgeModalProps): JSX.Element | null {
  const t = useTranslations('pages.hub.openBadges');
  if (!openBadge) {
    return null;
  }
  const { levels } = openBadge;

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      closeLabel={t('detailsModal.closeLabel')}
      maxWidth="sm"
      themeSection={ThemeSection.OpenBadge}
    >
      <SectionTitle icon={<OpenBadgeIcon color="secondary" />}>{openBadge.name}</SectionTitle>
      <ModalIllustration
        src={openBadge.coverImage}
        alt={openBadge.name}
        fallback={t('detailsModal.illustrationPlaceholder')}
        className={styles.modalIllustration}
      />
      <Section p={2}>
        <SectionSubtitle className={styles.sectionSubtitle}>{t('detailsModal.sectionSubtitle')}</SectionSubtitle>
        <Typography variant="body1">{openBadge.description}</Typography>
      </Section>

      <Section className={styles.modalActions} p={2}>
        {onAssign ? (
          <Button variant="contained" size="large" fullWidth onClick={onAssign}>
            {t('detailsModal.actions.assign')}
          </Button>
        ) : null}
        <Tooltip title={t('detailsModal.actions.downloadUnavailable')}>
          <span>
            <Button variant="contained" size="large" fullWidth disabled>
              {t('detailsModal.actions.download')}
            </Button>
          </span>
        </Tooltip>
      </Section>

      <Section className={styles.levelList} p={0}>
        {levels.map((level) => (
          <Accordion
            className={styles.accordion}
            key={`${openBadge.id}-detail-${level.level}`}
            defaultExpanded={level.level === openBadge.activeLevel}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <LevelChip
                level={level.level}
                isActive={level.level === openBadge.activeLevel}
                className={styles.levelChip}
              />
              <Typography variant="h3" className={styles.levelTitle}>
                {level.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.primary">
                {level.description}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Section>
    </ModalLayout>
  );
}
