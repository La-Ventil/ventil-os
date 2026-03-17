import type { OpenBadgeRequirementRule } from './open-badge-requirement-rule';

export type OpenBadgeRequirementLevel = {
  id: string;
  title?: string | null;
  level?: number | null;
};

export type OpenBadgeRequirement = {
  id: string;
  rule: OpenBadgeRequirementRule;
  openBadge: {
    id: string;
    name: string;
    type?: string | null;
    imageUrl?: string | null;
  };
  level?: OpenBadgeRequirementLevel | null;
};

export type OpenBadgeRequirementInput = Omit<OpenBadgeRequirement, 'level'> & {
  level?: (OpenBadgeRequirementLevel & { openBadgeId: string }) | null;
};

export type OpenBadgeRequirementErrorCode = 'openBadgeRequirement.levelBadgeMismatch';

export class OpenBadgeRequirementError extends Error {
  readonly code: OpenBadgeRequirementErrorCode;

  constructor(code: OpenBadgeRequirementErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'OpenBadgeRequirementError';
    this.code = code;
  }
}

export const isOpenBadgeRequirementError = (error: unknown): error is OpenBadgeRequirementError =>
  error instanceof OpenBadgeRequirementError;

const assertRequirementLevelBelongsToBadge = (input: OpenBadgeRequirementInput): void => {
  if (!input.level) {
    return;
  }

  if (input.level.openBadgeId !== input.openBadge.id) {
    throw new OpenBadgeRequirementError(
      'openBadgeRequirement.levelBadgeMismatch',
      `Open badge requirement level ${input.level.id} does not belong to badge ${input.openBadge.id}.`
    );
  }
};

export const OpenBadgeRequirement = {
  from(input: OpenBadgeRequirementInput): OpenBadgeRequirement {
    assertRequirementLevelBelongsToBadge(input);

    return {
      id: input.id,
      rule: input.rule,
      openBadge: input.openBadge,
      level: input.level
        ? {
            id: input.level.id,
            title: input.level.title,
            level: input.level.level
          }
        : null
    };
  }
};

export type OpenBadgeLevelCheck = {
  requiredLevel: number;
  userLevel: number | null;
};
