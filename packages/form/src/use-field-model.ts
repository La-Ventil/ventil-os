import { useFieldState } from './use-field-state';

type FieldModelOptions<TValue> = {
  value: TValue;
  touched?: boolean;
};

export type FieldModelResult<TValue> = readonly [TValue, (value: TValue) => void];

export function useFieldModel<TValue>({ value, touched }: FieldModelOptions<TValue>): FieldModelResult<TValue> {
  const field = useFieldState<TValue>({ value, touched });
  return [field.value, field.setValue] as const;
}
