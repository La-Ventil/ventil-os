import { describe, expect, it } from 'vitest';
import { OpenBadgeError } from '../badge/open-badge-errors';
import { assertCanDeactivateBadge, assertCanDeleteBadge } from '../badge/open-badge-deactivation-policy';

describe('open badge deactivation policy', () => {
  it('allows deactivation when no machine is attached', () => {
    expect(() => assertCanDeactivateBadge(0)).not.toThrow();
  });

  it('rejects deactivation when machines are attached', () => {
    expect(() => assertCanDeactivateBadge(1)).toThrowError(new OpenBadgeError('openBadge.status.attachedToMachines'));
  });

  it('allows deletion when no user progress exists', () => {
    expect(() => assertCanDeleteBadge(0)).not.toThrow();
  });

  it('rejects deletion when the badge is already assigned', () => {
    expect(() => assertCanDeleteBadge(1)).toThrowError(new OpenBadgeError('openBadge.delete.alreadyAssigned'));
  });
});
