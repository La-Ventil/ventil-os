import { z } from 'zod';

export const DEFAULT_NAME_MAX_LENGTH = 40;
export const emojiPattern = /\p{Extended_Pictographic}/u;

export const containsEmoji = (value: string): boolean => emojiPattern.test(value);

export const nameSchema = (options: {
  requiredMessage: string;
  maxLengthMessage: string;
  noEmojiMessage: string;
  maxLength?: number;
}) => {
  const maxLength = options.maxLength ?? DEFAULT_NAME_MAX_LENGTH;

  return z
    .string()
    .min(1, { message: options.requiredMessage })
    .max(maxLength, { message: options.maxLengthMessage })
    .refine((value) => !containsEmoji(value), { message: options.noEmojiMessage });
};
