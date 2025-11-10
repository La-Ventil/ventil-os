export interface FormState<FormData> {
  message: string;
  fieldErrors: never[];
  values: FormData;
  isValid?: boolean;
}
