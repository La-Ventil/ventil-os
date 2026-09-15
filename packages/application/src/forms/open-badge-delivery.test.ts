import { describe, expect, it } from 'vitest';
import { deliveryToTrainerThreshold, trainerThresholdToDelivery } from './open-badge-delivery';

// The form speaks in `level-N` options behind an on/off switch; the domain speaks in a trainer
// threshold, the lowest level from which a holder may deliver the badge — or none at all.
describe('deliveryToTrainerThreshold', () => {
  it('leaves the badge deliverable by admins only when delivery is off', () => {
    expect(deliveryToTrainerThreshold({ deliveryEnabled: false, deliveryLevel: 'level-2' })).toBeNull();
  });

  it('turns the chosen option into the level it names', () => {
    expect(deliveryToTrainerThreshold({ deliveryEnabled: true, deliveryLevel: 'level-2' })).toBe(2);
  });

  it('falls back to the first level, as the form itself does, when no option was sent', () => {
    expect(deliveryToTrainerThreshold({ deliveryEnabled: true, deliveryLevel: undefined })).toBe(1);
    expect(deliveryToTrainerThreshold({ deliveryEnabled: true, deliveryLevel: '' })).toBe(1);
  });

  it('refuses an option that names no level rather than guessing one', () => {
    expect(() => deliveryToTrainerThreshold({ deliveryEnabled: true, deliveryLevel: 'level-zero' })).toThrow();
    expect(() => deliveryToTrainerThreshold({ deliveryEnabled: true, deliveryLevel: 'level-0' })).toThrow();
  });
});

describe('trainerThresholdToDelivery', () => {
  it('shows delivery off, on the first level, for a badge nobody but admins may deliver', () => {
    expect(trainerThresholdToDelivery(null)).toEqual({ deliveryEnabled: false, deliveryLevel: 'level-1' });
  });

  it('shows delivery on, on the stored level', () => {
    expect(trainerThresholdToDelivery(3)).toEqual({ deliveryEnabled: true, deliveryLevel: 'level-3' });
  });

  it('round-trips through the form', () => {
    expect(deliveryToTrainerThreshold(trainerThresholdToDelivery(2))).toBe(2);
    expect(deliveryToTrainerThreshold(trainerThresholdToDelivery(null))).toBeNull();
  });
});
