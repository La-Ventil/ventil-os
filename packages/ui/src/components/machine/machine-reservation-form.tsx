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
import { parseIsoDate } from '@repo/application';
import { excludeUserFromList } from '@repo/application';
import type { MachineReservationFormInput } from '@repo/application/forms';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import UserAutocomplete from '../inputs/user-autocomplete';
import LocalizedDateTimePicker from '../inputs/localized-date-time-picker';
import FormAlert from '../forms/form-alert';
import FormActions from '../form-actions';
import Form from '../forms/form';
import { toZonedDayjs } from '../../utils/dayjs';
import useTimeZone from '../../hooks/use-time-zone';
import styles from './machine-reservation-form.module.css';

export type MachineReservationFormProps = {
  machineId: string;
  startAt: Date;
  participantOptions?: UserSummaryViewModel[];
  currentUserId?: string;
  onCancel: () => void;
  formState: FormActionStateTuple<MachineReservationFormInput>;
};

const RESERVATION_DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const DEFAULT_RESERVATION_DURATION_MINUTES = RESERVATION_DURATION_OPTIONS[0] ?? 15;

export const createMachineReservationInitialState = (
  machineId: string,
  startAt: Date,
  durationMinutes: number = DEFAULT_RESERVATION_DURATION_MINUTES
) =>
  createFormState<MachineReservationFormInput>({
    machineId,
    startsAt: startAt.toISOString(),
    durationMinutes,
    participantIds: []
  });

export default function MachineReservationForm({
  machineId,
  startAt,
  participantOptions,
  currentUserId,
  onCancel,
  formState: [state, action, isPending, handleSubmit, handleRetry]
}: MachineReservationFormProps): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');
  const format = useFormatter();
  const timeZone = useTimeZone();
  const fieldError = (field: keyof MachineReservationFormInput) => firstFieldError(state, field);
  const [participants, setParticipants] = useState<UserSummaryViewModel[]>([]);
  const [startDate, setStartDate] = useState<Dayjs>(() => toZonedDayjs(startAt, timeZone));
  const filteredParticipants = useMemo(
    () => excludeUserFromList(participants, currentUserId),
    [participants, currentUserId]
  );

  const filteredOptions = useMemo(
    () => excludeUserFromList(participantOptions, currentUserId),
    [participantOptions, currentUserId]
  );

  useEffect(() => {
    const parsed = parseIsoDate(state.values.startsAt);
    if (parsed) setStartDate(toZonedDayjs(parsed, timeZone));
  }, [state.values.startsAt, timeZone]);

  const formattedStart = useMemo(
    () => format.dateTime(startDate.toDate(), { dateStyle: 'short', timeStyle: 'short', timeZone }),
    [format, startDate, timeZone]
  );

  const handleParticipantsChange = (nextParticipants: UserSummaryViewModel[]) => {
    setParticipants(excludeUserFromList(nextParticipants, currentUserId));
  };

  return (
    <Form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="machineId" value={machineId} />
      <input type="hidden" name="startsAt" value={startDate.toDate().toISOString()} />
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
            error: Boolean(fieldError('startsAt'))
          }
        }}
      />

      <FormControl fullWidth error={Boolean(fieldError('durationMinutes'))}>
        <InputLabel id="machine-reservation-duration-label">{t('modal.reservationForm.durationLabel')}</InputLabel>
        <Select
          labelId="machine-reservation-duration-label"
          name="durationMinutes"
          defaultValue={state.values.durationMinutes ?? DEFAULT_RESERVATION_DURATION_MINUTES}
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
          {t('modal.reservationForm.confirm')}
        </Button>
      </FormActions>
    </Form>
  );
}
