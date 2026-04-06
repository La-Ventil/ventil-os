import type { MouseEventHandler } from 'react';
import type { AvatarCategoryId } from '@repo/avatar-system';
import type { AvatarOptionPreviewResolver } from './avatar-editor.types';
import styles from './avatar-variant-option-button.module.css';

type AvatarVariantOptionButtonProps = {
  categoryId: AvatarCategoryId;
  optionId: string;
  selected: boolean;
  ariaLabel: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  resolvePreviewSrc?: AvatarOptionPreviewResolver;
};

export default function AvatarVariantOptionButton({
  categoryId,
  optionId,
  selected,
  ariaLabel,
  onClick,
  resolvePreviewSrc
}: AvatarVariantOptionButtonProps) {
  const previewSrc = resolvePreviewSrc?.(categoryId, optionId) ?? null;
  return (
    <button
      type="button"
      className={styles.optionButton}
      data-active={selected ? 'true' : 'false'}
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={styles.optionPreview}>
        {optionId === 'none' ? (
          <span aria-hidden className={styles.fallbackLabel}>
            none
          </span>
        ) : previewSrc ? (
          <img src={previewSrc} alt="" aria-hidden className={styles.optionPreviewImage} />
        ) : (
          <span aria-hidden className={styles.fallbackLabel}>
            missing
          </span>
        )}
      </span>
    </button>
  );
}
