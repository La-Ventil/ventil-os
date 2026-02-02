export type FormDataObject = Record<string, FormDataEntryValue | FormDataEntryValue[]>;

/**
 * Collect FormData entries. If a key appears multiple times, values are stored as an array.
 */
export function formDataToObject(formData: FormData): FormDataObject {
  const result: FormDataObject = {};

  for (const [key, value] of formData.entries()) {
    if (key in result) {
      const current = result[key];
      result[key] = Array.isArray(current) ? [...current, value] : [current, value];
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Simplified helper for text‑only forms: flattens FormData to a string record.
 * Non‑string values are stringified via toString().
 */
export function formDataToStringRecord<T extends Record<string, string | undefined> = Record<string, string>>(
  formData: FormData
): T {
  const result: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    result[key] = value.toString();
  }
  return result as T;
}
