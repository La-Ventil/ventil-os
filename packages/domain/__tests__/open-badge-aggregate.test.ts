import { describe, expect, it } from 'vitest';
import { OpenBadge } from '../badge/open-badge';
import { OpenBadgeLevel } from '../badge/open-badge-level';

describe('OpenBadge aggregate', () => {
  it('sorts levels and validates active level', () => {
    const badge = OpenBadge.from({
      id: 'badge-1',
      type: 'Training',
      name: 'Laser',
      coverImage: undefined,
      description: 'Test',
      levels: [OpenBadgeLevel.from(2), OpenBadgeLevel.from(1)],
      activeLevel: 1
    });

    expect(badge.levels.map((level) => level.level)).toEqual([1, 2]);
    expect(OpenBadge.getActiveLevel(badge)?.level).toBe(1);
  });

  it('throws when active level does not exist', () => {
    expect(() =>
      OpenBadge.from({
        id: 'badge-2',
        type: 'Training',
        name: 'Printer',
        coverImage: undefined,
        description: 'Test',
        levels: [OpenBadgeLevel.from(1)],
        activeLevel: 3
      })
    ).toThrow('does not exist');
  });

  it('throws on duplicated levels', () => {
    expect(() =>
      OpenBadge.from({
        id: 'badge-3',
        type: 'Training',
        name: 'CNC',
        coverImage: undefined,
        description: 'Test',
        levels: [OpenBadgeLevel.from(1), OpenBadgeLevel.from(1)],
        activeLevel: 1
      })
    ).toThrow('duplicated');
  });
});
