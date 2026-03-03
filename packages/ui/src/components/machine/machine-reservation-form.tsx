'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import { excludeBy, parseIsoDate } from '@repo/application';
import type { MachineReservationFormInput } from '@repo/application/forms';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import { fieldErrorMessage } from '@repo/form/form-errors';
import UserAutocomplete from '../inputs/user-autocomplete';
import LocalizedDateTimePicker from '../inputs/localized-date-time-picker';
import FormAlert from '../forms/form-alert';
import FormActions from '../form-actions';
import Form from '../forms/form';
import { toZonedDayjs } from '../../utils/dayjs';
import useTimeZone from '../../hooks/use-time-zone';
import DangerZone from '../danger-zone';
import styles from './machine-reservation-form.module.css';

export type MachineReservationFormProps = {
  machineId: string;
  startAt: Date;
  reservationId?: string;
  initialParticipants?: UserSummaryViewModel[];
  participantOptions?: UserSummaryViewModel[];
  currentUserId?: string;
  onCancel: () => void;
  onCancelReservation?: () => Promise<{ success: boolean; message: string }>;
  formState: FormActionStateTuple<MachineReservationFormInput>;
};

const RESERVATION_DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const DEFAULT_RESERVATION_DURATION_MINUTES = RESERVATION_DURATION_OPTIONS[0] ?? 15;

export const createMachineReservationInitialState = (
  machineId: string,
  startAt: Date,
  durationMinutes: number = DEFAULT_RESERVATION_DURATION_MINUTES,
  participantIds: string[] = [],
  reservationId?: string
) =>
  createFormState<MachineReservationFormInput>({
    reservationId,
    machineId,
    startsAt: startAt.toISOString(),
    durationMinutes,
    participantIds
  });

export default function MachineReservationForm({
  machineId,
  startAt,
  reservationId,
  initialParticipants,
  participantOptions,
  currentUserId,
  onCancel,
  onCancelReservation,
  formState: [state, action, isPending, handleSubmit, handleRetry]
}: MachineReservationFormProps): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');
  const format = useFormatter();
  const timeZone = useTimeZone();
  const fieldError = (field: keyof MachineReservationFormInput) => fieldErrorMessage(state, field);
  const [participants, setParticipants] = useState<UserSummaryViewModel[]>(() => initialParticipants ?? []);
  const [startDate, setStartDate] = useState<Dayjs>(() => toZonedDayjs(startAt, timeZone));
  const filteredParticipants = useMemo(
    () => excludeBy(participants, (user) => user.id, currentUserId),
    [participants, currentUserId]
  );

  const filteredOptions = useMemo(
    () => excludeBy(participantOptions, (user) => user.id, currentUserId),
    [participantOptions, currentUserId]
  );
  const isStartDateValid = startDate.isValid();
  const serializedStartAt = isStartDateValid ? startDate.toDate().toISOString() : '';

  useEffect(() => {
    const parsed = parseIsoDate(state.values.startsAt);
    if (parsed) setStartDate(toZonedDayjs(parsed, timeZone));
  }, [state.values.startsAt, timeZone]);

  useEffect(() => {
    setParticipants(initialParticipants ?? []);
  }, [initialParticipants]);

  const formattedStart = useMemo(
    () =>
      isStartDateValid ? format.dateTime(startDate.toDate(), { dateStyle: 'short', timeStyle: 'short', timeZone }) : '',
    [format, isStartDateValid, startDate, timeZone]
  );
  const confirmLabel = reservationId
    ? t('modal.reservationForm.update')
    : t('modal.reservationForm.confirm');

  const handleParticipantsChange = (nextParticipants: UserSummaryViewModel[]) => {
    setParticipants(excludeBy(nextParticipants, (user) => user.id, currentUserId));
  };

  return (
    <Form action={action} onSubmit={handleSubmit}>
      {reservationId ? <input type="hidden" name="reservationId" value={reservationId} /> : null}
      <input type="hidden" name="machineId" value={machineId} />
      <input type="hidden" name="startsAt" value={serializedStartAt} />
      {filteredParticipants.map((participant) => (
        <input key={participant.id} type="hidden" name="participantIds" value={participant.id} />
      ))}
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />

      <Typography variant="body2" className={styles.description}>
        {t('modal.reservationForm.description')}
      </Typography>

      <LocalizedDateTimePicker
        label={t('modal.reservationForm.startLabel')}
        value={startDate}
        onChange={(value: Dayjs | null) => {
          if (value) {
            setStartDate(value);
          }
        }}
        timezone={timeZone}
        slotProps={{
          textField: {
            fullWidth: true,
            helperText: fieldError('startsAt') ?? formattedStart,
            error: Boolean(fieldError('startsAt') || !isStartDateValid)
          }
        }}
      />

      <FormControl fullWidth error={Boolean(fieldError('durationMinutes'))}>
        <InputLabel id="machine-reservation-duration-label">{t('modal.reservationForm.durationLabel')}</InputLabel>
        <Select
          labelId="machine-reservation-duration-label"
          name="durationMinutes"
          defaultValue={state.values.durationMinutes ?? DEFAULT_RESERVATION_DURATION_MINUTES}
          key={state.values.durationMinutes ?? DEFAULT_RESERVATION_DURATION_MINUTES}
          label={t('modal.reservationForm.durationLabel')}
        >
          {RESERVATION_DURATION_OPTIONS.map((minutes) => (
            <MenuItem key={minutes} value={minutes}>
              {t('modal.reservationForm.durationOption', { minutes })}
            </MenuItem>
          ))}
        </Select>
        {fieldError('durationMinutes') ? <FormHelperText>{fieldError('durationMinutes')}</FormHelperText> : null}
      </FormControl>

      <Typography variant="body2" className={styles.participantsHint}>
        {t('modal.reservationForm.participantsHint')}
      </Typography>
      <UserAutocomplete
        label={t('modal.reservationForm.participantsLabel')}
        placeholder={t('modal.reservationForm.participantsPlaceholder')}
        options={filteredOptions}
        value={filteredParticipants}
        onChange={handleParticipantsChange}
      />

      <FormActions className={styles.actions}>
        <Button type="button" variant="outlined" onClick={onCancel}>
          {t('modal.reservationForm.back')}
        </Button>
        <Button variant="contained" type="submit" disabled={isPending}>
          {confirmLabel}
        </Button>
      </FormActions>

      {reservationId && onCancelReservation ? (
        <DangerZone
          title={t('modal.reservationForm.cancelTitle')}
          description={t('modal.reservationForm.cancelDescription')}
          actionLabel={t('modal.reservationForm.cancelAction')}
          disabled={isPending}
          onAction={onCancelReservation}
          onSuccess={onCancel}
        />
      ) : null}
    </Form>
  );
}
