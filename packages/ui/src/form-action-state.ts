import { useActionState } from 'react';
import { FormState } from './form-state';

export type FormActionStateParameters<State, Payload = FormData> = Parameters<typeof useActionState<State, Payload>>;
export type FormAction<Values, Payload = FormData> = FormActionStateParameters<FormState<Values>, Payload>[0];
export type FormActionState<Values, Payload = FormData> = FormActionStateParameters<FormState<Values>, Payload>[0];
export type FormActionStateTuple<State, Payload = FormData> = ReturnType<typeof useActionState<State, Payload>>;
