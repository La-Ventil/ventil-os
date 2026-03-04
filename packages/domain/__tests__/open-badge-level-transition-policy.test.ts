import { describe, expect, it } from 'vitest';
import {
  canAdvanceOpenBadgeLevel,
  canDowngradeOpenBadgeLevel
} from '../badge/open-badge-level-transition-policy';

describe('open badge level transition policy', () => {
  it('allows assigning only the next level', () => {
    expect(canAdvanceOpenBadgeLevel(null, 1)).toBe(true);
    expect(canAdvanceOpenBadgeLevel(0, 1)).toBe(true);
    expect(canAdvanceOpenBadgeLevel(1, 2)).toBe(true);

    expect(canAdvanceOpenBadgeLevel(null, 2)).toBe(false);
    expect(canAdvanceOpenBadgeLevel(1, 1)).toBe(false);
    expect(canAdvanceOpenBadgeLevel(1, 3)).toBe(false);
  });

  it('allows downgrading only one level at a time above level 1', () => {
    expect(canDowngradeOpenBadgeLevel(3, 2)).toBe(true);
    expect(canDowngradeOpenBadgeLevel(2, 1)).toBe(true);

    expect(canDowngradeOpenBadgeLevel(null, 1)).toBe(false);
    expect(canDowngradeOpenBadgeLevel(1, 0)).toBe(false);
    expect(canDowngradeOpenBadgeLevel(3, 1)).toBe(false);
    expect(canDowngradeOpenBadgeLevel(3, 3)).toBe(false);
  });
});
