import { useActionState } from 'react';
import { FormState } from './form-state';

export type FormActionStateParameters<FormData> = Parameters<typeof useActionState<FormState<FormData>, FormData>>;
export type FormAction<FormData> = FormActionStateParameters<FormData>[0];

export type FormActionStateTuple<FormData> = ReturnType<typeof useActionState<FormState<FormData>, FormData>>;
