import type { OpenBadgeLevelCheck } from '../badge/open-badge-requirement';
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
