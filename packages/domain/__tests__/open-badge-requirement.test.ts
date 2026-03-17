import { describe, expect, it } from 'vitest';
import {
  OpenBadgeRequirement,
  OpenBadgeRequirementError
} from '../badge/open-badge-requirement';
import { OpenBadgeRequirementRule } from '../badge/open-badge-requirement-rule';

describe('OpenBadgeRequirement', () => {
  it('accepts a requirement without a specific level', () => {
    const requirement = OpenBadgeRequirement.from({
      id: 'requirement-1',
      rule: OpenBadgeRequirementRule.All,
      openBadge: {
        id: 'badge-1',
        name: '3D Printing'
      },
      level: null
    });

    expect(requirement.level).toBeNull();
    expect(requirement.openBadge.id).toBe('badge-1');
  });

  it('accepts a requirement level when it belongs to the same badge', () => {
    const requirement = OpenBadgeRequirement.from({
      id: 'requirement-1',
      rule: OpenBadgeRequirementRule.All,
      openBadge: {
        id: 'badge-1',
        name: '3D Printing'
      },
      level: {
        id: 'level-1',
        openBadgeId: 'badge-1',
        title: 'Autonomous user',
        level: 1
      }
    });

    expect(requirement.level?.id).toBe('level-1');
    expect(requirement.level?.level).toBe(1);
  });

  it('rejects a requirement level that belongs to another badge', () => {
    const invalidRequirement = () =>
      OpenBadgeRequirement.from({
        id: 'requirement-1',
        rule: OpenBadgeRequirementRule.All,
        openBadge: {
          id: 'badge-1',
          name: '3D Printing'
        },
        level: {
          id: 'level-2',
          openBadgeId: 'badge-2',
          title: 'Expert user',
          level: 2
        }
      });

    expect(invalidRequirement).toThrowError(OpenBadgeRequirementError);

    try {
      invalidRequirement();
    } catch (error) {
      expect(error).toBeInstanceOf(OpenBadgeRequirementError);
      expect((error as OpenBadgeRequirementError).code).toBe('openBadgeRequirement.levelBadgeMismatch');
    }
  });
});
