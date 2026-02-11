import { describe, it, expect } from 'vitest';
import type { DayKey } from '../date-time';
import { formatDayKey, parseDayKey, tryParseDayKey } from '../date-time';

describe('date-time', () => {
  it('round-trips day keys in a timezone', () => {
    const timeZone = 'Europe/Paris';
    const dayKey = '2024-01-15' as DayKey;
    const parsed = parseDayKey(dayKey, timeZone);
    const formatted = formatDayKey(parsed, timeZone);
    expect(formatted).toBe(dayKey);
  });

  it('rejects invalid day keys', () => {
    expect(tryParseDayKey('2024-02-31')).toBeNull();
    expect(tryParseDayKey('2024-2-1')).toBeNull();
  });

  it('throws on invalid day keys when parsing', () => {
    const timeZone = 'Europe/Paris';
    expect(() => parseDayKey('2024-02-31' as DayKey, timeZone)).toThrow('Invalid day key');
  });
});
