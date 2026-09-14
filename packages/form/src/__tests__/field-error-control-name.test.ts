import { describe, expect, it } from 'vitest';
import { fieldErrorKeyToControlName } from '../use-form-action-state';

describe('fieldErrorKeyToControlName', () => {
  it('leaves a plain field untouched', () => {
    expect(fieldErrorKeyToControlName('name')).toBe('name');
  });

  it('turns a dotted index into the bracket notation used by control names', () => {
    expect(fieldErrorKeyToControlName('levels.0.title')).toBe('levels[0].title');
  });

  it('handles an index at the end of the path', () => {
    expect(fieldErrorKeyToControlName('levels.2')).toBe('levels[2]');
  });

  it('handles several indexes', () => {
    expect(fieldErrorKeyToControlName('levels.1.badges.3.title')).toBe('levels[1].badges[3].title');
  });

  it('does not touch a segment that merely starts with a digit', () => {
    expect(fieldErrorKeyToControlName('levels.0name')).toBe('levels.0name');
  });
});
