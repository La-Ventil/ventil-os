export type Level = number & { readonly __brand: 'Level' };

export const Level = {
  from(value: number): Level {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('Level must be a positive integer.');
    }

    return value as Level;
  }
};
