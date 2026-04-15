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

/** In-memory cache scoped to the modal session: dayKey → revived reservations */
type ReservationsByDayCache = Map<DayKey, MachineReservationViewModel[]>;

export type FetchReservationsForDayOptions = {
  /** Bypass the cache and force a network request — use after a write operation */
  skipCache?: boolean;
};

type UseMachineReservationsDayOptions = {
  machineId: string;
  timeZone: string;
  initialReservations: MachineReservationViewModel[];
};

const reviveReservation = (
  reservation: ReservationQueryPayload['reservations'][number]
): MachineReservationViewModel => ({
  ...reservation,
  startsAt: new Date(reservation.startsAt),
  endsAt: new Date(reservation.endsAt)
});

export function useMachineReservationsDay({
  machineId,
  timeZone,
  initialReservations
}: UseMachineReservationsDayOptions) {
  const [reservations, setReservations] = useState<MachineReservationViewModel[]>(initialReservations);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequest = useRef(0);
  const reservationsByDayCache = useRef<ReservationsByDayCache>(new Map());

  const resetReservations = useCallback((nextReservations: MachineReservationViewModel[]) => {
    setReservations(nextReservations);
  }, []);

  const fetchReservationsForDay = useCallback(
    async (dayKey: DayKey, options?: FetchReservationsForDayOptions) => {
      if (!machineId) return;

      const cachedReservations = !options?.skipCache && reservationsByDayCache.current.get(dayKey);
      if (cachedReservations) {
        setReservations(cachedReservations);
        return;
      }

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

        const revivedReservations = payload.reservations.map(reviveReservation);
        reservationsByDayCache.current.set(dayKey, revivedReservations);
        setReservations(revivedReservations);
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
