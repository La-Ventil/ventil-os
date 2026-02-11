'use client';

import type { JSX } from 'react';
import { useTranslations } from 'next-intl';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import type { MachineReservationFormInput } from '@repo/application/forms';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { MachineIcon } from '../icons/machine-icon';
import ModalLayout from '../modal-layout';
import ModalIllustration from '../modal-illustration';
import Section from '../section';
import SectionSubtitle from '../section-subtitle';
import SectionTitle from '../section-title';
import { ThemeSection } from '../../theme';
import MachineReservationForm from './machine-reservation-form';
import styles from './machine-modal.module.css';

export type MachineReservationModalProps = {
  machine: MachineDetailsViewModel;
  participantOptions?: UserSummaryViewModel[];
  startAt: Date;
  formState: FormActionStateTuple<MachineReservationFormInput>;
  currentUserId?: string;
  open: boolean;
  onClose: () => void;
};

export default function MachineReservationModal({
  machine,
  participantOptions,
  startAt,
  formState,
  currentUserId,
  open,
  onClose
}: MachineReservationModalProps): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');

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

      <Section p={2} className={styles.reservationSection}>
        <SectionSubtitle className={styles.sectionSubtitle}>{t('modal.reservationTitle')}</SectionSubtitle>
        <MachineReservationForm
          machineId={machine.id}
          startAt={startAt}
          participantOptions={participantOptions}
          currentUserId={currentUserId}
          onCancel={onClose}
          formState={formState}
        />
      </Section>
    </ModalLayout>
  );
}
