import { describe, it, expect } from 'vitest';
import { parseIsoDate, resolveIsoDateFromQuery } from '../infra/iso-date';

describe('iso-date', () => {
  it('parses ISO date-times with offsets and rejects local strings', () => {
    expect(parseIsoDate('2024-01-15')).toBeNull();
    expect(parseIsoDate('2024-01-15T10:15')).toBeNull();
    expect(parseIsoDate('2024-01-15T10:15:00Z')).toBeInstanceOf(Date);
    expect(parseIsoDate('2024-01-15T10:15:00+01:00')).toBeInstanceOf(Date);
  });

  it('resolves ISO date from query without fallback', () => {
    expect(resolveIsoDateFromQuery('2024-01-15')).toBeNull();
    expect(resolveIsoDateFromQuery(null)).toBeNull();
  });
});
