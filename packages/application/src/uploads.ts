import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const MAX_IMAGE_MB = 5;
export const ALLOWED_IMAGE_MIMES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp'
};

export type ImageValidationResult =
  | { url: string }
  | { error: string; fieldErrors: Record<string, string[]> };

export async function validateAndStoreImage(
  file: File | null,
  t: (...args: any[]) => string,
  options?: {
    maxMb?: number;
    uploadRoot?: string;
    publicPath?: string;
  }
): Promise<ImageValidationResult> {
  const maxMb = options?.maxMb ?? MAX_IMAGE_MB;
  const maxBytes = maxMb * 1024 * 1024;
  const uploadRoot = options?.uploadRoot ?? path.join(process.cwd(), 'apps', 'web', 'public', 'uploads');
  const publicPath = options?.publicPath ?? '/uploads';

  if (!(file instanceof File) || file.size === 0) {
    const msg = t('validation.openBadge.imageRequired');
    return { error: msg, fieldErrors: { imageUrl: [msg] } };
  }

  if (!ALLOWED_IMAGE_MIMES[file.type]) {
    const msg = t('validation.imageInvalidType');
    return { error: msg, fieldErrors: { imageUrl: [msg] } };
  }

  if (file.size > maxBytes) {
    const max = `${maxMb}MB`;
    const msg = t('validation.imageTooLarge', { max });
    return { error: msg, fieldErrors: { imageUrl: [msg] } };
  }

  const extension = ALLOWED_IMAGE_MIMES[file.type];
  const filename = `${randomUUID()}.${extension}`;
  await fs.mkdir(uploadRoot, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filepath = path.join(uploadRoot, filename);
  await fs.writeFile(filepath, buffer);

  return { url: path.posix.join(publicPath, filename) };
}
