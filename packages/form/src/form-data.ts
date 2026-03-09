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
export function formDataToValues<Schema extends z.ZodType>(
  formData: FormData,
  schema: Schema,
  options?: { dropFiles?: boolean }
): z.infer<Schema> {
  const dropFiles = options?.dropFiles ?? true;
  const raw = schema.parse(formData);
  return (dropFiles ? stripFileValues(raw) : raw) as z.infer<Schema>;
}

type FormPathToken = string | number;

const isNumericToken = (value: string): boolean => /^\d+$/.test(value);

const parseFormPath = (key: string): FormPathToken[] => {
  const normalized = key.replace(/\[(\d+)\]/g, '.$1');
  return normalized
    .split('.')
    .filter(Boolean)
    .map((segment) => (isNumericToken(segment) ? Number(segment) : segment));
};

const firstArrayRootPath = (path: FormPathToken[]): FormPathToken[] | null => {
  const firstArrayIndex = path.findIndex((token) => typeof token === 'number');
  if (firstArrayIndex <= 0) {
    return null;
  }

  return path.slice(0, firstArrayIndex);
};

const setPathValue = (target: unknown, path: FormPathToken[], value: unknown): void => {
  if (!path.length) return;
  let current: unknown = target;

  for (let index = 0; index < path.length - 1; index += 1) {
    const token = path[index];
    const nextToken = path[index + 1];
    if (token === undefined || nextToken === undefined) return;

    if (typeof token === 'number') {
      if (!Array.isArray(current)) return;
      if (current[token] === undefined || current[token] === null) {
        current[token] = typeof nextToken === 'number' ? [] : {};
      }
      current = current[token];
      continue;
    }

    if (typeof current !== 'object' || current === null) return;
    const record = current as Record<string, unknown>;
    if (record[token] === undefined || record[token] === null) {
      record[token] = typeof nextToken === 'number' ? [] : {};
    }
    current = record[token];
  }

  const lastToken = path[path.length - 1];
  if (lastToken === undefined) return;
  if (typeof lastToken === 'number') {
    if (!Array.isArray(current)) return;
    current[lastToken] = value;
    return;
  }

  if (typeof current !== 'object' || current === null) return;
  (current as Record<string, unknown>)[lastToken] = value;
};

const cloneValues = <TValues extends Record<string, unknown>>(values: TValues): TValues => {
  try {
    return structuredClone(values);
  } catch {
    return { ...values };
  }
};

const normalizeEntry = (entry: FormDataEntryValue, dropFiles: boolean): unknown =>
  entry instanceof File ? (dropFiles ? undefined : entry) : entry;

/**
 * Best-effort value extraction from FormData without schema validation.
 * Useful to preserve user input when client-side schema validation fails.
 */
export function formDataToRedisplayValues<TValues extends Record<string, unknown>>(
  formData: FormData,
  previousValues: TValues,
  options?: { dropFiles?: boolean }
): TValues {
  const dropFiles = options?.dropFiles ?? true;
  const nextValues = cloneValues(previousValues) as Record<string, unknown>;
  const uniqueKeys = Array.from(new Set(formData.keys()));
  const parsedPaths = uniqueKeys.map((key) => parseFormPath(key));
  const repeatableRootPaths = new Map<string, FormPathToken[]>();

  for (const path of parsedPaths) {
    const rootPath = firstArrayRootPath(path);
    if (!rootPath) continue;

    const rootPathKey = JSON.stringify(rootPath);
    if (!repeatableRootPaths.has(rootPathKey)) {
      repeatableRootPaths.set(rootPathKey, rootPath);
    }
  }

  for (const path of repeatableRootPaths.values()) {
    setPathValue(nextValues, path, []);
  }

  for (let index = 0; index < uniqueKeys.length; index += 1) {
    const key = uniqueKeys[index];
    const path = parsedPaths[index];
    if (!key || !path) continue;

    const entries = formData.getAll(key).map((entry) => normalizeEntry(entry, dropFiles));
    const value = entries.length > 1 ? entries : entries[0];
    setPathValue(nextValues, path, value);
  }

  for (const [key, currentValue] of Object.entries(nextValues)) {
    if (formData.has(key)) continue;
    if (typeof currentValue === 'boolean') {
      nextValues[key] = false;
      continue;
    }
    if (typeof currentValue === 'string' && currentValue === 'on') {
      nextValues[key] = '';
    }
  }

  return nextValues as TValues;
}
