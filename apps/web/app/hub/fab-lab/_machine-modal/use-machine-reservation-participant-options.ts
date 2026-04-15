'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';

type ParticipantOptionsPayload = {
  participantOptions: UserSummaryViewModel[];
};

type UseMachineReservationParticipantOptionsOptions = {
  machineId: string;
  initialParticipantOptions: UserSummaryViewModel[];
  enabled: boolean;
};

export function useMachineReservationParticipantOptions({
  machineId,
  initialParticipantOptions,
  enabled
}: UseMachineReservationParticipantOptionsOptions) {
  const [participantOptions, setParticipantOptions] = useState<UserSummaryViewModel[]>(initialParticipantOptions);
  const [hasLoadedParticipantOptions, setHasLoadedParticipantOptions] = useState(initialParticipantOptions.length > 0);
  const [isLoadingParticipantOptions, setIsLoadingParticipantOptions] = useState(false);
  // Use a ref to guard against concurrent fetches without adding isLoadingParticipantOptions
  // to effect deps — doing so would cause the cleanup to set `active = false` mid-flight,
  // which silently cancels the fetch and leaves the options empty.
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setParticipantOptions(initialParticipantOptions);
    setHasLoadedParticipantOptions(initialParticipantOptions.length > 0);
  }, [initialParticipantOptions]);

  useEffect(() => {
    if (!enabled || hasLoadedParticipantOptions || isFetchingRef.current) {
      return;
    }

    let active = true;
    isFetchingRef.current = true;
    setIsLoadingParticipantOptions(true);

    void fetch(`/api/machines/${machineId}/reservation-form`, {
      credentials: 'same-origin',
      cache: 'no-store'
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ParticipantOptionsPayload;
        if (!active) {
          return;
        }

        setParticipantOptions(payload.participantOptions);
        setHasLoadedParticipantOptions(true);
      })
      .finally(() => {
        isFetchingRef.current = false;
        if (active) {
          setIsLoadingParticipantOptions(false);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled, hasLoadedParticipantOptions, machineId]);

  return useMemo(
    () => ({
      participantOptions,
      isLoadingParticipantOptions
    }),
    [participantOptions, isLoadingParticipantOptions]
  );
}
