import { z } from 'zod';

const emojiPattern = /\p{Extended_Pictographic}/u;

export const nameSchema = (options: {
  requiredMessage: string;
  maxLengthMessage: string;
  noEmojiMessage: string;
  maxLength?: number;
}) => {
  const maxLength = options.maxLength ?? 40;

  return z
    .string()
    .min(1, { message: options.requiredMessage })
    .max(maxLength, { message: options.maxLengthMessage })
    .refine((value) => !emojiPattern.test(value), { message: options.noEmojiMessage });
};
