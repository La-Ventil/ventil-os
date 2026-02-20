'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { MachineViewModel } from '@repo/view-models/machine';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import CardList from './card-list';
import MachineCard from './machine-card';
import MachineReservationListCard from './machine/machine-reservation-list-card';
import ListEmptyState from './list-empty-state';

export type MachineTabsProps = {
  machines: MachineViewModel[];
  machineHrefBase?: string;
  reservations?: MachineReservationViewModel[];
  currentUserId?: string;
  canManageReservations?: boolean;
  onCancelReservation?: (reservationId: string) => Promise<{ success: boolean; message: string }>;
  onReleaseReservation?: (reservationId: string) => Promise<{ success: boolean; message: string }>;
};

export default function MachineTabs({
  machines,
  machineHrefBase,
  reservations = [],
  currentUserId,
  canManageReservations,
  onCancelReservation,
  onReleaseReservation
}: MachineTabsProps): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const handleMachineClick = (machineId: string) =>
    machineHrefBase
      ? () => {
          router.push(`${machineHrefBase}/${machineId}`);
        }
      : undefined;

  const machineById = useMemo(
    () => new Map(machines.map((machine) => [machine.id, machine])),
    [machines]
  );

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        variant="fullWidth"
        aria-label={t('tabs.ariaLabel')}
      >
        <Tab label={t('tabs.available')} />
        <Tab label={t('tabs.reservations')} />
      </Tabs>

      {tabValue === 0 ? (
        <CardList component="section">
          {machines.length ? (
            machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} t={t} onClick={handleMachineClick(machine.id)} />
            ))
          ) : (
            <ListEmptyState title={t('machines.empty')} />
          )}
        </CardList>
      ) : (
        <CardList component="section">
          {reservations.length ? (
            reservations.map((reservation) => {
              const machine = machineById.get(reservation.machineId);
              return (
                <MachineReservationListCard
                  key={reservation.id}
                  reservation={reservation}
                  machine={machine}
                  fallbackTitle={t('card.title')}
                  fallbackCategory={t('card.category')}
                  currentUserId={currentUserId}
                  canManageReservations={canManageReservations}
                  onCancel={onCancelReservation}
                  onRelease={onReleaseReservation}
                />
              );
            })
          ) : (
            <ListEmptyState title={t('reservations.empty')} />
          )}
        </CardList>
      )}
    </>
  );
}
