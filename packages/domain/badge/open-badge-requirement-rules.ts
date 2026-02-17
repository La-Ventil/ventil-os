import { OpenBadgeRequirementRule, isAnyRule } from './open-badge-requirement-rule';
import type { OpenBadgeLevelCheck } from './open-badge-requirement';

export const pickCombinationRule = (rules: OpenBadgeRequirementRule[]): OpenBadgeRequirementRule =>
  rules.some((rule) => isAnyRule(rule))
    ? OpenBadgeRequirementRule.Any
    : OpenBadgeRequirementRule.All;

export const meetsLevelRequirement = (userLevel: number | null, requiredLevel: number): boolean =>
  userLevel !== null && userLevel >= requiredLevel;

export const applyCombinationRule = (rule: OpenBadgeRequirementRule, levelChecks: boolean[]): boolean =>
  rule === OpenBadgeRequirementRule.Any ? levelChecks.some(Boolean) : levelChecks.every(Boolean);

export const isRequirementSatisfied = (rule: OpenBadgeRequirementRule, levelChecks: OpenBadgeLevelCheck[]): boolean =>
  applyCombinationRule(
    rule,
    levelChecks.map((check) => meetsLevelRequirement(check.userLevel, check.requiredLevel))
  );
