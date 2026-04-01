import { MAX_IMAGE_MB } from '@repo/storage/image-upload';
import { validateAndStoreImage } from '@repo/storage/uploads';

type UploadTranslator = (key: string, params?: Record<string, string>) => string;

export type ResolvedImageUpload =
  | { ok: true; imageUrl: string | null | undefined }
  | {
      ok: false;
      field: string;
      message: string;
    };

export async function resolveImageUpload(
  file: File | null | undefined,
  t: UploadTranslator,
  options?: {
    required?: boolean;
    field?: string;
    emptyValue?: string | null | undefined;
    requiredMessageKey?: string;
    maxMb?: number;
    subdirectory?: string;
  }
): Promise<ResolvedImageUpload> {
  const field = options?.field ?? 'imageFile';
  const emptyValue = options?.emptyValue;

  if (!file) {
    if (options?.required) {
      return {
        ok: false,
        field,
        message: t(options.requiredMessageKey ?? 'validation.imageRequired')
      };
    }

    return { ok: true, imageUrl: emptyValue };
  }

  const imageResult = await validateAndStoreImage(file, {
    maxMb: options?.maxMb ?? MAX_IMAGE_MB,
    field,
    subdirectory: options?.subdirectory
  });

  if ('error' in imageResult) {
    return {
      ok: false,
      field: imageResult.field ?? field,
      message: t(`validation.${imageResult.error}`, imageResult.params)
    };
  }

  return { ok: true, imageUrl: imageResult.url };
}
