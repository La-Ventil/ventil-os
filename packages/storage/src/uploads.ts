import fs from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_MB, type ImageValidationResult } from './image-upload';

// Upload paths are runtime config: turbopackIgnore keeps file tracing from bundling the directory they resolve to.
// Every filesystem access to uploads goes through these helpers so the hint lives in one place.
const resolveUploadPath = (base: string, ...segments: string[]) =>
  path.resolve(/* turbopackIgnore: true */ base, ...segments);

const uploadFs = {
  mkdir: (directory: string) => fs.mkdir(/* turbopackIgnore: true */ directory, { recursive: true }),
  assertWritable: (directory: string) => fs.access(/* turbopackIgnore: true */ directory, fsConstants.W_OK),
  read: (file: string) => fs.readFile(/* turbopackIgnore: true */ file),
  write: (file: string, data: Buffer) => fs.writeFile(/* turbopackIgnore: true */ file, data)
};

function resolveUploadSubdirectory(subdirectory?: string) {
  if (!subdirectory) {
    return undefined;
  }

  const normalized = path.posix.normalize(subdirectory).replace(/^\/+|\/+$/g, '');
  if (!normalized || normalized === '.' || normalized.startsWith('..') || normalized.includes('/../')) {
    throw new Error('Upload subdirectory must stay within the upload root.');
  }

  return normalized;
}

// Relative UPLOADS_DIR resolves from the cwd (development). Production passes the absolute bucket mount,
// because the standalone server changes its cwd.
function getResolvedUploadRoot(uploadRoot: string = getUploadRootSetting(), cwd: string = process.cwd()) {
  return resolveUploadPath(cwd, uploadRoot);
}

export function getUploadRootSetting() {
  const envUploadRoot = process.env.UPLOADS_DIR;
  if (!envUploadRoot) {
    throw new Error(
      'UPLOADS_DIR is required: a path relative to the process cwd (e.g. "uploads") or an absolute path.'
    );
  }

  return envUploadRoot;
}

export function getUploadsPublicPath() {
  const publicPath = process.env.UPLOADS_PUBLIC_PATH ?? '/uploads';
  return publicPath.startsWith('/') ? publicPath : `/${publicPath}`;
}

/** Returns the uploaded file under the upload root, or null when it is missing or outside the root. */
export async function readUpload(segments: string[]): Promise<Buffer | null> {
  const uploadRoot = getResolvedUploadRoot();
  const file = resolveUploadPath(uploadRoot, ...segments);

  if (file !== uploadRoot && !file.startsWith(`${uploadRoot}${path.sep}`)) {
    return null;
  }

  try {
    return await uploadFs.read(file);
  } catch (error) {
    const { code } = error as NodeJS.ErrnoException;
    if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EISDIR') {
      return null;
    }

    throw error;
  }
}

async function ensureUploadRoot(uploadRoot: string) {
  try {
    await uploadFs.mkdir(uploadRoot);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'EACCES') {
      throw err;
    }
    await uploadFs.assertWritable(uploadRoot);
  }
}

export async function validateAndStoreImage(
  file: File | null,
  options?: {
    maxMb?: number;
    uploadRoot?: string;
    publicPath?: string;
    field?: string;
    subdirectory?: string;
  }
): Promise<ImageValidationResult> {
  const maxMb = options?.maxMb ?? MAX_IMAGE_MB;
  const maxBytes = maxMb * 1024 * 1024;
  const uploadRootSetting = options?.uploadRoot ?? getUploadRootSetting();

  const uploadRoot = getResolvedUploadRoot(uploadRootSetting);
  const publicPath = options?.publicPath ?? getUploadsPublicPath();
  const field = options?.field;
  const subdirectory = resolveUploadSubdirectory(options?.subdirectory);
  const targetDirectory = subdirectory ? resolveUploadPath(uploadRoot, subdirectory) : uploadRoot;

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
  await ensureUploadRoot(targetDirectory);

  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadFs.write(resolveUploadPath(targetDirectory, filename), buffer);

  return {
    url: subdirectory ? path.posix.join(publicPath, subdirectory, filename) : path.posix.join(publicPath, filename)
  };
}
