import type { FormState } from './form-state';

/**
 * Field-level accessors for inline form rendering.
 * This module stays intentionally narrow:
 * - use it when a component needs the message for one specific field
 * - use `@repo/form/form-feedback` when a component needs aggregated banner/action feedback
 */
export const firstFieldError = <TValues>(state: FormState<TValues>, field: keyof TValues): string | undefined =>
  state.fieldErrors?.[field]?.[0];
