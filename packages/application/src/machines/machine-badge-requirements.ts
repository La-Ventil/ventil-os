import { openBadgeRepository } from '@repo/db';
import { OpenBadgeRequirement, type OpenBadgeRequirementError } from '@repo/domain/badge/open-badge-requirement';
import { OpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';

export type MachineBadgeRequirementInput = {
  openBadgeId: string;
  openBadgeLevelId?: string | null;
  rule?: OpenBadgeRequirementRule;
};

export type MachineBadgeRequirementWriteModel = {
  requiredOpenBadgeId: string;
  requiredOpenBadgeLevelId: string | null;
  rule: OpenBadgeRequirementRule;
};

const normalizeRule = (rule?: OpenBadgeRequirementRule): OpenBadgeRequirementRule =>
  rule ?? OpenBadgeRequirementRule.All;

const resolveMachineBadgeRequirement = async (
  input: MachineBadgeRequirementInput
): Promise<MachineBadgeRequirementWriteModel> => {
  const requirement = await openBadgeRepository.getOpenBadgeRequirementDefinition({
    openBadgeId: input.openBadgeId,
    openBadgeLevelId: input.openBadgeLevelId,
    rule: normalizeRule(input.rule)
  });

  if (!requirement) {
    throw new Error('machine.badgeRequirement.notFound');
  }

  const validatedRequirement = OpenBadgeRequirement.from(requirement);

  return {
    requiredOpenBadgeId: validatedRequirement.openBadge.id,
    requiredOpenBadgeLevelId: validatedRequirement.level?.id ?? null,
    rule: validatedRequirement.rule
  };
};

export const resolveMachineBadgeRequirements = async (
  inputs: MachineBadgeRequirementInput[] = []
): Promise<MachineBadgeRequirementWriteModel[]> =>
  Promise.all(inputs.map((input) => resolveMachineBadgeRequirement(input)));

export const isMachineBadgeRequirementError = (error: unknown): error is Error | OpenBadgeRequirementError =>
  error instanceof Error &&
  (error.message === 'machine.badgeRequirement.notFound' ||
    ('code' in error && error.code === 'openBadgeRequirement.levelBadgeMismatch'));
