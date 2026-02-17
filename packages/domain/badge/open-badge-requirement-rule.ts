export enum OpenBadgeRequirementRule {
  All = 'all',
  Any = 'any'
}

export const toOpenBadgeRequirementRule = (rule: string): OpenBadgeRequirementRule =>
  rule === OpenBadgeRequirementRule.Any ? OpenBadgeRequirementRule.Any : OpenBadgeRequirementRule.All;

export const isAnyRule = (rule: OpenBadgeRequirementRule): boolean =>
  rule === OpenBadgeRequirementRule.Any;
