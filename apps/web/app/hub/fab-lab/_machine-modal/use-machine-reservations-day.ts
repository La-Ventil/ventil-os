'use client';

import { useCallback, useRef, useState } from 'react';
import type { DayKey } from '@repo/application';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';

type ReservationQueryPayload = {
  reservations: Array<
    Omit<MachineReservationViewModel, 'startsAt' | 'endsAt'> & {
      startsAt: string;
      endsAt: string;
    }
  >;
};

const reviveReservation = (
  reservation: ReservationQueryPayload['reservations'][number]
): MachineReservationViewModel => ({
  ...reservation,
  startsAt: new Date(reservation.startsAt),
  endsAt: new Date(reservation.endsAt)
});

type UseMachineReservationsDayOptions = {
  machineId: string;
  timeZone: string;
  initialReservations: MachineReservationViewModel[];
};

export function useMachineReservationsDay({
  machineId,
  timeZone,
  initialReservations
}: UseMachineReservationsDayOptions) {
  const [reservations, setReservations] = useState<MachineReservationViewModel[]>(initialReservations);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequest = useRef(0);

  const resetReservations = useCallback((nextReservations: MachineReservationViewModel[]) => {
    setReservations(nextReservations);
  }, []);

  const fetchReservationsForDay = useCallback(
    async (dayKey: DayKey) => {
      if (!machineId) return;

      const requestId = latestRequest.current + 1;
      latestRequest.current = requestId;
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/machines/${machineId}/reservations?day=${encodeURIComponent(dayKey)}&timeZone=${encodeURIComponent(
            timeZone
          )}`,
          {
            credentials: 'same-origin',
            cache: 'no-store'
          }
        );

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ReservationQueryPayload;
        if (latestRequest.current !== requestId) {
          return;
        }

        setReservations(payload.reservations.map(reviveReservation));
      } finally {
        if (latestRequest.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    [machineId, timeZone]
  );

  return {
    reservations,
    isLoading,
    resetReservations,
    fetchReservationsForDay
  };
}
