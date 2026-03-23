import { describe, expect, it } from 'vitest';
import { OpenBadgeError } from '../badge/open-badge-errors';
import { assertCanDeactivateBadge } from '../badge/open-badge-deactivation-policy';

describe('open badge deactivation policy', () => {
  it('allows deactivation when no machine is attached', () => {
    expect(() => assertCanDeactivateBadge(0)).not.toThrow();
  });

  it('rejects deactivation when machines are attached', () => {
    expect(() => assertCanDeactivateBadge(1)).toThrowError(new OpenBadgeError('openBadge.status.attachedToMachines'));
  });
});
