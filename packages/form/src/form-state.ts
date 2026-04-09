type FormPrimitive = string | number | boolean | bigint | symbol | null | undefined | Date | File | FileList | Blob;

type StringKeyOf<TValues> = Extract<keyof TValues, string>;

export type FormFieldPath<TValues> = TValues extends FormPrimitive
  ? never
  : TValues extends readonly (infer TItem)[]
    ? TItem extends FormPrimitive
      ? `${number}`
      : `${number}` | `${number}.${FormFieldPath<TItem>}`
    : {
        [TKey in StringKeyOf<TValues>]: TValues[TKey] extends FormPrimitive
          ? TKey
          : TValues[TKey] extends readonly (infer TItem)[]
            ? TItem extends FormPrimitive
              ? TKey | `${TKey}.${number}`
              : TKey | `${TKey}.${number}` | `${TKey}.${number}.${FormFieldPath<TItem>}`
            : TValues[TKey] extends object
              ? TKey | `${TKey}.${FormFieldPath<TValues[TKey]>}`
              : TKey;
      }[StringKeyOf<TValues>];

export type FormFieldErrorKey<TValues> = FormFieldPath<TValues> | '_form';

export type FormFieldErrors<TValues> = Partial<Record<FormFieldErrorKey<TValues>, string[]>> &
  Partial<Record<string, string[]>>;

/**
 * Standard shape returned by form server actions.
 * - success : résultat global (métier / persistance).
 * - valid   : validation des inputs (Zod, contraintes de formulaire).
 * - fieldErrors : erreurs par champ quand valid === false.
 * - errorCode   : optionnel pour mapper des erreurs métier côté UI.
 *
 * Note: `isValid` est conservé pour compatibilité avec l'existant ;
 * il reflète la valeur de `valid` et sera supprimé plus tard.
 */
export interface FormState<FormData> {
  success: boolean;
  valid: boolean;
  message?: string;
  fieldErrors: FormFieldErrors<FormData>;
  values: FormData;
  errorCode?: string;
  /** @deprecated utiliser `valid` */
  isValid?: boolean;
}

/**
 * For common helpers that build FormState consistently, see:
 * `@repo/form/form-state-builders`.
 */
export function createFormState<FormData>(values: FormData): FormState<FormData> {
  return {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values,
    isValid: undefined
  };
}
