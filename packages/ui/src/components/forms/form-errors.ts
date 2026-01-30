import type { FormState } from '../../form-state';

export const firstFieldError = <TValues>(state: FormState<TValues>, field: keyof TValues): string | undefined =>
  state.fieldErrors?.[field]?.[0];
