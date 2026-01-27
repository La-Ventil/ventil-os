import { useActionState } from 'react';
import { FormActionStateParameters } from './form-action-state';
import { FormState } from './form-state';

export function useFormActionState<State, Payload = FormData>(
  action: FormActionStateParameters<State, Payload>[0],
  initialState: State
) {
  return useActionState<State, Payload>(action, initialState as Awaited<State>);
}

export function useFormActionStateWithValues<Values, Payload = FormData>(
  action: FormActionStateParameters<FormState<Values>, Payload>[0],
  initialState: FormState<Values>
) {
  return useActionState<FormState<Values>, Payload>(
    action,
    initialState as Awaited<FormState<Values>>
  );
}
