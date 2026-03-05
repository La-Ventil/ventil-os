import { useEffect, useState } from 'react';

export type FieldStateResult<TValue> = {
  value: TValue;
  touched: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
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

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  useEffect(() => {
    setFieldTouched(initialTouched);
  }, [initialTouched]);

  return {
    value: fieldValue,
    touched: fieldTouched,
    setValue: setFieldValue,
    setTouched: setFieldTouched,
    markTouched: () => setFieldTouched(true)
  };
}
