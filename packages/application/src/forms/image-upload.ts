import { z } from 'zod';
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_MB } from '../server/uploads-constants';

const allowedMimeTypes = new Set(Object.keys(ALLOWED_IMAGE_MIMES));
const maxBytes = MAX_IMAGE_MB * 1024 * 1024;

export const IMAGE_UPLOAD_MAX_MB = MAX_IMAGE_MB;

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

export const normalizeOptionalImageFile = (value: unknown): unknown => {
  if (value instanceof File) {
    return value.size === 0 ? undefined : value;
  }

  return value === '' || value == null ? undefined : value;
};

export const optionalImageFileSchema = z.preprocess(normalizeOptionalImageFile, imageFileSchema.optional());

export type ImageFileInput = z.infer<typeof imageFileSchema>;
