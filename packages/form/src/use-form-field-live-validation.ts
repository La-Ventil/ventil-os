import { z } from 'zod';
import { fieldErrorMessage } from './form-errors';
import type { FormState } from './form-state';
import { useFieldLiveValidation, type FieldLiveValidationResult, type Translate } from './use-field-live-validation';
import type { ZodFieldValidationSchema } from './field-validation-shared';

type FieldKey = string;

type UnwrappableSchema = z.ZodType & {
  unwrap: () => z.ZodType;
};

const MAX_UNWRAP_DEPTH = 16;
const OBJECT_SCHEMA_CACHE = new WeakMap<z.ZodType, z.ZodObject<z.ZodRawShape> | null>();
const FIELD_SCHEMA_CACHE = new WeakMap<z.ZodType, Map<string, ZodFieldValidationSchema>>();

const isUnwrappableSchema = (schema: z.ZodType): schema is UnwrappableSchema => {
  return typeof (schema as Partial<UnwrappableSchema>).unwrap === 'function';
};

const resolveObjectSchema = (schema: z.ZodType): z.ZodObject<z.ZodRawShape> | null => {
  let current: z.ZodType = schema;

  for (let depth = 0; depth < MAX_UNWRAP_DEPTH; depth += 1) {
    if (current instanceof z.ZodObject) {
      return current as z.ZodObject<z.ZodRawShape>;
    }

    if (current instanceof z.ZodPipe) {
      current = current.out as unknown as z.ZodType;
      continue;
    }

    if (isUnwrappableSchema(current)) {
      current = current.unwrap();
      continue;
    }

    return null;
  }

  return null;
};

const resolveObjectSchemaCached = (schema: z.ZodType): z.ZodObject<z.ZodRawShape> | null => {
  if (OBJECT_SCHEMA_CACHE.has(schema)) {
    return OBJECT_SCHEMA_CACHE.get(schema) ?? null;
  }

  const resolved = resolveObjectSchema(schema);
  OBJECT_SCHEMA_CACHE.set(schema, resolved);
  return resolved;
};

const extractFieldSchemaFromFormSchema = (schema: z.ZodType, field: string): ZodFieldValidationSchema => {
  const fieldSchemaCache = FIELD_SCHEMA_CACHE.get(schema);
  const cached = fieldSchemaCache?.get(field);
  if (cached) {
    return cached;
  }

  const objectSchema = resolveObjectSchemaCached(schema);
  if (!objectSchema) {
    throw new Error(
      'Unable to resolve a Zod object shape from form schema for field live validation. ' +
        'Use a direct field schema hook for this form.'
    );
  }

  const fieldSchema = objectSchema.shape[field];
  if (!fieldSchema) {
    throw new Error(`Missing validation schema for form field "${field}".`);
  }

  const resolvedFieldSchema = fieldSchema as ZodFieldValidationSchema;
  if (fieldSchemaCache) {
    fieldSchemaCache.set(field, resolvedFieldSchema);
  } else {
    FIELD_SCHEMA_CACHE.set(schema, new Map([[field, resolvedFieldSchema]]));
  }

  return resolvedFieldSchema;
};

export type UseFormFieldLiveValidationOptions<
  TValues extends Record<FieldKey, unknown>,
  TField extends Extract<keyof TValues, FieldKey>
> = {
  state: Pick<FormState<TValues>, 'values' | 'fieldErrors'>;
  field: TField;
  schema: z.ZodType;
  t?: Translate;
  touched?: boolean;
  skipUntouchedBlank?: (value: TValues[TField]) => boolean;
  serverError?: string;
};

export type BoundFormFieldLiveValidationOptions<TValues extends Record<FieldKey, unknown>> = Pick<
  UseFormFieldLiveValidationOptions<TValues, Extract<keyof TValues, FieldKey>>,
  'state' | 't' | 'touched' | 'skipUntouchedBlank' | 'serverError'
>;

type BoundFormFieldLiveValidationOverrides<TValues extends Record<FieldKey, unknown>> = {
  touched?: BoundFormFieldLiveValidationOptions<TValues>['touched'];
  skipUntouchedBlank?: BoundFormFieldLiveValidationOptions<TValues>['skipUntouchedBlank'];
  serverError?: BoundFormFieldLiveValidationOptions<TValues>['serverError'];
};

export function useFormFieldLiveValidation<
  TValues extends Record<FieldKey, unknown>,
  TField extends Extract<keyof TValues, FieldKey>
>({
  state,
  field,
  schema: formSchema,
  t,
  touched,
  skipUntouchedBlank,
  serverError
}: UseFormFieldLiveValidationOptions<TValues, TField>): FieldLiveValidationResult<TValues[TField]> {
  const value = state.values[field] as TValues[TField];
  const fieldSchema = extractFieldSchemaFromFormSchema(formSchema, String(field));
  const fallbackError = fieldErrorMessage(state, field as keyof TValues);

  return useFieldLiveValidation({
    schema: fieldSchema,
    value,
    touched,
    t,
    skipUntouchedBlank: skipUntouchedBlank as ((value: unknown) => boolean) | undefined,
    serverError: serverError ?? fallbackError
  });
}

export function createFormFieldLiveValidation<TValues extends Record<FieldKey, unknown>>(
  formSchema: z.ZodType,
  base: BoundFormFieldLiveValidationOptions<TValues>
): <TField extends Extract<keyof TValues, FieldKey>>(
  field: TField,
  overrides?: BoundFormFieldLiveValidationOverrides<TValues>
) => FieldLiveValidationResult<TValues[TField]> {
  return function useBoundedFormFieldValidation<TField extends Extract<keyof TValues, FieldKey>>(
    field: TField,
    overrides: BoundFormFieldLiveValidationOverrides<TValues> = {}
  ): FieldLiveValidationResult<TValues[TField]> {
    const { touched, skipUntouchedBlank, serverError } = overrides;
    return useFormFieldLiveValidation<TValues, TField>({
      state: base.state,
      field,
      schema: formSchema,
      t: base.t,
      touched: touched ?? base.touched,
      skipUntouchedBlank: skipUntouchedBlank ?? base.skipUntouchedBlank,
      serverError: serverError ?? base.serverError
    });
  };
}
