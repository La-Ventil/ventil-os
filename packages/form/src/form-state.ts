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
  fieldErrors: Partial<Record<keyof FormData, string[]>>;
  values: FormData;
  errorCode?: string;
  /** @deprecated utiliser `valid` */
  isValid?: boolean;
}

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
