import { passwordConfirmationMatchSchema } from '@repo/application/forms';
import { zodErrorToMessages } from '@repo/form/zod-errors';
import { useFieldState } from '@repo/form/use-field-state';
import type { FieldStateResult } from '@repo/form/use-field-state';

type PasswordConfirmationTranslation = (key: string) => string;

type UsePasswordConfirmationValidationOptions = {
  password: string;
  passwordConfirmation: string;
  touched?: boolean;
  t: PasswordConfirmationTranslation;
};

type PasswordConfirmationValidationState = {
  passwordConfirmation: FieldStateResult<string>;
  errors: string[];
};

export function usePasswordConfirmationValidation({
  password,
  passwordConfirmation: initialPasswordConfirmation,
  touched = false,
  t
}: UsePasswordConfirmationValidationOptions): PasswordConfirmationValidationState {
  const passwordConfirmation = useFieldState<string>({
    value: initialPasswordConfirmation,
    touched
  });

  const parseResult = passwordConfirmationMatchSchema.safeParse({
    password,
    passwordConfirmation: passwordConfirmation.value
  });

  const errors = passwordConfirmation.touched && !parseResult.success ? zodErrorToMessages(parseResult.error, t) : [];

  return { passwordConfirmation, errors };
}
