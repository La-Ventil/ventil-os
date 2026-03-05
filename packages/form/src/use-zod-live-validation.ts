import { zodErrorMessagesFromSchema } from './zod-errors';

import { useFieldState } from './use-field-state';

export type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

type LiveValidationSchema = Parameters<typeof zodErrorMessagesFromSchema>[0]['schema'];
type LiveValidationValues = Parameters<typeof zodErrorMessagesFromSchema>[0];

type LiveValidationOptions<TValue> = {
  schema: LiveValidationSchema;
  value: TValue;
  t?: Translate;
  touched?: boolean;
  skipUntouchedBlank?: (value: TValue) => boolean;
};

export type LiveValidationResult<TValue> = {
  value: TValue;
  errors: string[];
  touched: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
};

export function useZodLiveValidation<TValue = unknown>({
  schema,
  value,
  t,
  touched: initialTouched = false,
  skipUntouchedBlank
}: LiveValidationOptions<TValue>): LiveValidationResult<TValue> {
  const fieldState = useFieldState<TValue>({
    value,
    touched: initialTouched
  });

  const errors = zodErrorMessagesFromSchema({
    schema,
    value: fieldState.value,
    touched: fieldState.touched,
    t,
    skipUntouchedBlank: skipUntouchedBlank as LiveValidationValues['skipUntouchedBlank']
  });

  return {
    value: fieldState.value,
    errors,
    touched: fieldState.touched,
    setValue: fieldState.setValue,
    setTouched: fieldState.setTouched,
    markTouched: fieldState.markTouched
  };
}
