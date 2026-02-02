/**
 * Flatten a FormData into a string record.
 * If a key appears multiple times, values are stored as a string array.
 * Non-string entries are stringified with toString().
 *
 * Use-case: build a lightweight "values" object for redisplay after
 * a failed submit (client validation or network error) without keeping
 * FormData itself in state.
 */
export function formDataToStringRecord<
  T extends Record<string, string | string[] | undefined> = Record<string, string | string[]>
>(formData: FormData): T {
  const result: Record<string, string | string[]> = {};
  for (const [key, value] of formData.entries()) {
    const stringValue = value.toString();
    const current = result[key];
    if (Array.isArray(current)) {
      result[key] = [...current, stringValue];
    } else if (typeof current === 'string') {
      result[key] = [current, stringValue];
    } else {
      result[key] = stringValue;
    }
  }
  return result as T;
}
