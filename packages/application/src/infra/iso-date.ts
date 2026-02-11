const ISO_DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

export const parseIsoDate = (value: string | null | undefined): Date | null => {
  if (!value || !ISO_DATETIME_REGEX.test(value)) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const resolveIsoDateFromQuery = (value: string | null | undefined): Date | null =>
  parseIsoDate(value);
