'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatInTimeZone } from 'date-fns-tz';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineIcon } from '../icons/machine-icon';
import ModalLayout from '../modal-layout';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import { ThemeSection } from '../../theme';
import MachineReservationSchedule from './machine-reservation-schedule';
import styles from './machine-modal.module.css';

export type MachineModalProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  date: string;
  open: boolean;
  onClose: () => void;
};

type MachineModalTab = 'info' | 'reservations';

export default function MachineModal({
  machine,
  reservations,
  date,
  open,
  onClose
}: MachineModalProps): JSX.Element | null {
  const t = useTranslations('pages.hub.fabLab');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<MachineModalTab>('reservations');
  const modalDate = useMemo(() => new Date(`${date}T00:00:00`), [date]);
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const formattedDate = useMemo(
    () => formatInTimeZone(modalDate, timeZone, locale.startsWith('fr') ? 'dd/MM/yy' : 'MM/dd/yy'),
    [locale, modalDate, timeZone]
  );

  if (!machine) {
    return null;
  }

  const badgeRequirement = machine.badgeRequirements[0];

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      closeLabel={t('modal.closeLabel')}
      maxWidth="sm"
      themeSection={ThemeSection.FabLab}
    >
      <SectionTitle icon={<MachineIcon color="secondary" />}>{machine.name}</SectionTitle>
      <Section p={2} className={styles.headerSection}>
        <div className={styles.modalIllustration}>
          {machine.imageUrl ? <img src={machine.imageUrl} alt={machine.name} /> : t('modal.illustrationPlaceholder')}
        </div>
      </Section>

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        aria-label={t('modal.tabs.ariaLabel')}
        variant="fullWidth"
      >
        <Tab value="info" label={t('modal.tabs.info')} />
        <Tab value="reservations" label={t('modal.tabs.reservations')} />
      </Tabs>

      {activeTab === 'info' ? (
        <Section p={2} className={styles.infoSection}>
          <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.availabilityLabel')}</SectionSubtitle>
          <Typography variant="body2" className={styles.availabilityValue}>
            {t(`status.${machine.availability}`)}
          </Typography>

          {badgeRequirement ? (
            <>
              <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.badgeRequirement')}</SectionSubtitle>
              <div className={styles.badgeRequirementCard}>
                <Typography variant="subtitle2" className={styles.badgeLabel}>
                  {badgeRequirement.badgeName}
                </Typography>
                {badgeRequirement.badgeLevelTitle ? (
                  <Typography variant="caption" color="text.secondary">
                    {badgeRequirement.badgeLevelTitle}
                  </Typography>
                ) : null}
              </div>
            </>
          ) : null}

          {machine.description ? (
            <>
              <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.descriptionLabel')}</SectionSubtitle>
              <Typography variant="body2">{machine.description}</Typography>
            </>
          ) : null}

          {machine.roomName ? (
            <>
              <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.locationLabel')}</SectionSubtitle>
              <Typography variant="body2">{machine.roomName}</Typography>
            </>
          ) : null}
        </Section>
      ) : (
        <Section p={2} className={styles.reservationSection}>
          <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.reservationTitle')}</SectionSubtitle>
          <Typography variant="body2" className={styles.reservationIntro}>
            {t('modal.reservationIntro')}
          </Typography>
          <div className={styles.dateRow}>
            <div className={styles.datePicker}>{formattedDate}</div>
          </div>
          <MachineReservationSchedule date={modalDate} reservations={reservations} />
        </Section>
      )}
    </ModalLayout>
  );
}
