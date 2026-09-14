import { useEffect, useState } from 'react';

export type FieldStateResult<TValue> = {
  value: TValue;
  touched: boolean;
  /** True once the user changed the value, false again when the form state takes over. */
  dirty: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
  /** Blur handler: leaving a field the user never changed must stay silent. */
  markTouchedIfDirty: () => void;
};

type FieldStateOptions<TValue> = {
  value: TValue;
  touched?: boolean;
};

export function useFieldState<TValue>({
  value,
  touched: initialTouched = false
}: FieldStateOptions<TValue>): FieldStateResult<TValue> {
  const [fieldValue, setFieldValue] = useState<TValue>(value);
  const [fieldTouched, setFieldTouched] = useState<boolean>(initialTouched);
  const [fieldDirty, setFieldDirty] = useState<boolean>(false);

  useEffect(() => {
    setFieldValue(value);
    // The form state just replaced the value: whatever the user typed before is no longer theirs.
    setFieldDirty(false);
  }, [value]);

  useEffect(() => {
    setFieldTouched(initialTouched);
  }, [initialTouched]);

  const setValue = (nextValue: TValue) => {
    setFieldDirty(true);
    setFieldValue(nextValue);
  };

  return {
    value: fieldValue,
    touched: fieldTouched,
    dirty: fieldDirty,
    setValue,
    setTouched: setFieldTouched,
    markTouched: () => setFieldTouched(true),
    markTouchedIfDirty: () => {
      if (fieldDirty) {
        setFieldTouched(true);
      }
    }
  };
}
