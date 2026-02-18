import type { OpenBadgeLevelCheck, OpenBadgeRequirement } from '../badge/open-badge-requirement';
import { pickCombinationRule, isRequirementSatisfied } from '../badge/open-badge-requirement-rules';
import type { OpenBadgeRequirementRule } from '../badge/open-badge-requirement-rule';

type ReservationRule = OpenBadgeRequirementRule;

export const isMachineReservationEligible = (
  rules: ReservationRule[],
  checks: OpenBadgeLevelCheck[]
): boolean => {
  if (!rules.length) {
    return true;
  }

  const rule = pickCombinationRule(rules);

  return isRequirementSatisfied(rule, checks);
};

export const buildReservationEligibilityChecks = (
  requirements: OpenBadgeRequirement[],
  userLevels: Map<string, number | null>
): OpenBadgeLevelCheck[] =>
  requirements.map((requirement) => ({
    requiredLevel: requirement.level?.level ?? 0,
    userLevel: userLevels.get(requirement.openBadge.id) ?? null
  }));
