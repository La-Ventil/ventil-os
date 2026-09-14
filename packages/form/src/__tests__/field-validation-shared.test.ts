import { describe, expect, it } from 'vitest';
import { createFieldFeedback } from '../field-validation-shared';

const serverError = () => 'Title is required';

describe('createFieldFeedback', () => {
  it('shows the submit error while the user has not touched the field again', () => {
    expect(createFieldFeedback([], serverError)).toEqual({
      error: true,
      helperText: 'Title is required'
    });
  });

  it('drops the submit error as soon as the user edits the field', () => {
    expect(createFieldFeedback([], serverError, { dirty: true })).toEqual({
      error: false,
      helperText: undefined
    });
  });

  it('keeps live errors while the user edits the field', () => {
    expect(createFieldFeedback(['Too long'], serverError, { dirty: true })).toEqual({
      error: true,
      helperText: 'Too long'
    });
  });

  it('prefers live errors over the submit error', () => {
    expect(createFieldFeedback(['Too long'], serverError).helperText).toBe('Too long');
  });

  it('joins several live errors', () => {
    expect(createFieldFeedback(['Too long', 'No digits'], () => undefined).helperText).toBe('Too long No digits');
  });

  it('reports no feedback when nothing is wrong', () => {
    expect(createFieldFeedback([], () => undefined)).toEqual({
      error: false,
      helperText: undefined
    });
  });
});
