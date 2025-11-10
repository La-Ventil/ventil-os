import { useActionState } from 'react';
import { FormState } from './form-state';
import { FormActionStateParameters } from './form-action-state';

export function useFormActionState<FormData>(
  action: FormActionStateParameters<FormData>[0],
  initialState: FormState<FormData>
) {
  return useActionState<FormState<FormData>, FormData>(action, initialState);
}
