import fs from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { pathToFileURL } from 'url';
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_MB, type ImageValidationResult } from './image-upload';

function resolveUploadRoot({ uploadRoot, cwd }: { uploadRoot: string; cwd: string }) {
  if (path.isAbsolute(uploadRoot)) {
    throw new Error('UPLOADS_DIR must be a relative path (no leading "/"). Example: public/uploads');
  }

  return path.join(cwd, uploadRoot);
}

async function ensureUploadRoot(uploadRoot: string) {
  try {
    await fs.mkdir(uploadRoot, { recursive: true });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'EACCES') {
      throw err;
    }
    await fs.access(uploadRoot, fsConstants.W_OK);
  }
}

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
  const envUploadRoot = process.env.UPLOADS_DIR;
  const envPublicPath = process.env.UPLOADS_PUBLIC_PATH;
  const uploadRootSetting = options?.uploadRoot ?? envUploadRoot;
  if (!uploadRootSetting) {
    throw new Error('UPLOADS_DIR is required. Use a relative path like "public/uploads".');
  }

  const uploadRoot = resolveUploadRoot({ uploadRoot: uploadRootSetting, cwd: process.cwd() });
  const publicPath = options?.publicPath ?? envPublicPath ?? '/uploads';
  const field = options?.field;

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'imageRequired', field };
  }

  if (!ALLOWED_IMAGE_MIMES[file.type]) {
    return { error: 'imageInvalidType', field };
  }

  if (file.size > maxBytes) {
    return { error: 'imageTooLarge', field, params: { max: `${maxMb}MB` } };
  }

  const extension = ALLOWED_IMAGE_MIMES[file.type];
  const filename = `${randomUUID()}.${extension}`;
  await ensureUploadRoot(uploadRoot);

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadRootUrl = pathToFileURL(`${uploadRoot}${path.sep}`);
  const fileUrl = new URL(filename, uploadRootUrl);
  await fs.writeFile(fileUrl, buffer);

  return { url: path.posix.join(publicPath, filename) };
}
