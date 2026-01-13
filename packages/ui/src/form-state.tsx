export interface FormState<FormData> {
  message: string;
  fieldErrors: Record<string, string[]>;
  values: FormData;
  isValid?: boolean;
}
