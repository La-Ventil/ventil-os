import { useActionState } from 'react';
import { FormState } from './form-state';
import { FormActionStateParameters } from './form-action-state';

export function useFormActionState<State, Payload = FormData>(
  action: FormActionStateParameters<State, Payload>[0],
  initialState: State
) {
  return useActionState<State, Payload>(action, initialState);
}

export function useFormActionStateWithValues<Values, Payload = FormData>(
  action: FormActionStateParameters<FormState<Values>, Payload>[0],
  initialState: FormState<Values>
) {
  return useActionState<FormState<Values>, Payload>(action, initialState);
}
