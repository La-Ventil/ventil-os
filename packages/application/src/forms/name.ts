import { z } from 'zod';

export const DEFAULT_NAME_MAX_LENGTH = 40;
export const emojiPattern = /\p{Extended_Pictographic}/u;

export const containsEmoji = (value: string): boolean => emojiPattern.test(value);

export const nameSchema = (
  options: {
    requiredMessage?: string;
    maxLengthMessage?: string;
    noEmojiMessage?: string;
    maxLength?: number;
  } = {}
) => {
  const requiredMessage = options.requiredMessage ?? 'validation.name.required';
  const maxLengthMessage = options.maxLengthMessage ?? 'validation.name.maxLength';
  const noEmojiMessage = options.noEmojiMessage ?? 'validation.name.noEmoji';
  const maxLength = options.maxLength ?? DEFAULT_NAME_MAX_LENGTH;

  return z
    .string()
    .min(1, { message: requiredMessage })
    .max(maxLength, { message: maxLengthMessage })
    .refine((value) => !containsEmoji(value), { message: noEmojiMessage });
};
