import { z } from 'zod';
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_MB } from '../uploads-constants';

const allowedMimeTypes = new Set(Object.keys(ALLOWED_IMAGE_MIMES));
const maxBytes = MAX_IMAGE_MB * 1024 * 1024;

/**
 * Lightweight, pure validation schema for an uploaded image File.
 * - MIME must be in ALLOWED_IMAGE_MIMES
 * - Size must be <= MAX_IMAGE_MB
 *
 * Messages use validation keys so the caller can translate them.
 */
export const imageFileSchema = z.instanceof(File).superRefine((file, ctx) => {
  if (!allowedMimeTypes.has(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'validation.imageInvalidType'
    });
  }

  if (file.size > maxBytes) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'validation.imageTooLarge'
    });
  }
});

export type ImageFileInput = z.infer<typeof imageFileSchema>;
