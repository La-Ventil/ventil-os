import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_MB } from '../uploads-constants';

export type ImageValidationError = 'imageRequired' | 'imageInvalidType' | 'imageTooLarge';

export type ImageValidationResult =
  | { url: string }
  | {
      error: ImageValidationError;
      /**
       * Field key to attach the error to (defaults to "imageUrl" in callers)
       */
      field?: string;
      /**
       * Extra params used for i18n interpolation (e.g. { max: "5MB" })
       */
      params?: Record<string, string>;
    };

export async function validateAndStoreImage(
  file: File | null,
  options?: {
    maxMb?: number;
    uploadRoot?: string;
    publicPath?: string;
    field?: string;
  }
): Promise<ImageValidationResult> {
  const maxMb = options?.maxMb ?? MAX_IMAGE_MB;
  const maxBytes = maxMb * 1024 * 1024;
  const uploadRoot =
    options?.uploadRoot ??
    (path.basename(process.cwd()) === 'web' && path.basename(path.dirname(process.cwd())) === 'apps'
      ? path.join(process.cwd(), 'public', 'uploads')
      : path.join(process.cwd(), 'apps', 'web', 'public', 'uploads'));
  const publicPath = options?.publicPath ?? '/uploads';
  const field = options?.field;

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'imageRequired', field };
  }

  if (!ALLOWED_IMAGE_MIMES[file.type]) {
    return { error: 'imageInvalidType', field };
  }

  if (file.size > maxBytes) {
    const max = `${maxMb}MB`;
    return { error: 'imageTooLarge', field, params: { max } };
  }

  const extension = ALLOWED_IMAGE_MIMES[file.type];
  const filename = `${randomUUID()}.${extension}`;
  await fs.mkdir(uploadRoot, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filepath = path.join(uploadRoot, filename);
  await fs.writeFile(filepath, buffer);

  return { url: path.posix.join(publicPath, filename) };
}
