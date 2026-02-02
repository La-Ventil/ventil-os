import { z } from 'zod';

const stripFileValues = (value: unknown): unknown => {
  if (value instanceof File) return undefined;
  if (Array.isArray(value)) return value.map((item) => stripFileValues(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, stripFileValues(item)])
    );
  }
  return value;
};

/**
 * Parse a FormData into a values object using the provided schema.
 * Throws when the schema rejects the input.
 *
 * Use-case: build a "values" object for redisplay after a failed submit
 * without keeping FormData itself in state. Files are dropped by default.
 */
export function formDataToValues<Schema extends z.ZodTypeAny>(
  formData: FormData,
  schema: Schema,
  options?: { dropFiles?: boolean }
): z.infer<Schema> {
  const dropFiles = options?.dropFiles ?? true;
  const raw = schema.parse(formData);
  return (dropFiles ? stripFileValues(raw) : raw) as z.infer<Schema>;
}
