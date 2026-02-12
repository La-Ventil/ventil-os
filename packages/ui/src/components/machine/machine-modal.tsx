'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineIcon } from '../icons/machine-icon';
import ModalLayout from '../modal-layout';
import ModalIllustration from '../modal-illustration';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import { ThemeSection } from '../../theme';
import type { DayKey } from '@repo/application';
import { formatDayKey } from '@repo/application';
import { toZonedDayjs } from '../../utils/dayjs';
import useTimeZone from '../../hooks/use-time-zone';
import MachineReservationSchedule from './machine-reservation-schedule';
import LocalizedDatePicker from '../inputs/localized-date-picker';
import MachineAvailabilityStatus from './machine-availability-status';
import MachineBadgeRequirementCard from './machine-badge-requirement-card';
import styles from './machine-modal.module.css';

export type MachineModalProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  dayKey: DayKey;
  open: boolean;
  canReserve?: boolean;
  onClose: () => void;
  onOpenReservation?: (slot: Date) => void;
  onDateChange?: (dayKey: DayKey) => void;
};

type MachineModalTab = 'info' | 'reservations';

export default function MachineModal({
  machine,
  reservations,
  dayKey,
  open,
  canReserve = true,
  onClose,
  onOpenReservation,
  onDateChange
}: MachineModalProps): JSX.Element | null {
  const t = useTranslations('pages.hub.fabLab');
  const [activeTab, setActiveTab] = useState<MachineModalTab>('reservations');
  const timeZone = useTimeZone();
  const modalDate = useMemo(() => toZonedDayjs(`${dayKey}T00:00:00`, timeZone), [dayKey, timeZone]);

  if (!machine) {
    return null;
  }

  const badgeRequirement = machine.badgeRequirements[0];
  const showBadgeLock = Boolean(badgeRequirement && !canReserve);

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      closeLabel={t('modal.closeLabel')}
      maxWidth="sm"
      fullWidth
      themeSection={ThemeSection.FabLab}
    >
      <SectionTitle icon={<MachineIcon color="secondary" />}>{machine.name}</SectionTitle>
      <ModalIllustration
        src={machine.imageUrl}
        alt={machine.name}
        fallback={t('modal.illustrationPlaceholder')}
        className={styles.modalIllustration}
      />

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
          <MachineAvailabilityStatus
            availability={machine.availability}
            label={t(`status.${machine.availability}`)}
          />

          {badgeRequirement ? (
            <>
              <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.badgeRequirement')}</SectionSubtitle>
              <MachineBadgeRequirementCard
                requirement={badgeRequirement}
                badgeTypeLabel={t('modal.badgeType')}
                illustrationPlaceholder={t('modal.illustrationPlaceholder')}
                showLock={showBadgeLock}
              />
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
          <LocalizedDatePicker
            label={t('modal.schedule.dateLabel')}
            value={modalDate}
            onChange={(value: Dayjs | null) => {
              if (value && onDateChange) {
                onDateChange(formatDayKey(value, timeZone));
              }
            }}
            timezone={timeZone}
            slotProps={{
              textField: {
                fullWidth: true,
                className: styles.datePicker
              }
            }}
          />
        </div>
          <MachineReservationSchedule
            dayKey={dayKey}
            reservations={reservations}
            onSlotClick={onOpenReservation}
          />
        </Section>
      )}
    </ModalLayout>
  );
}
