export const MAX_IMAGE_MB = 5;

export const ALLOWED_IMAGE_MIMES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp'
};

export type ImageValidationError = 'imageRequired' | 'imageInvalidType' | 'imageTooLarge';

export type ImageValidationResult =
  | { url: string }
  | {
      error: ImageValidationError;
      field?: string;
      params?: Record<string, string>;
    };
