import type { MouseEventHandler } from 'react';
import type { AvatarSelection } from '@repo/avatar-system';
import { Avatar } from '@repo/avatar-system/react';
import styles from './avatar-variant-option-button.module.css';

type AvatarVariantOptionButtonProps = {
  previewSelection: AvatarSelection;
  selected: boolean;
  ariaLabel: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function AvatarVariantOptionButton({
  previewSelection,
  selected,
  ariaLabel,
  onClick
}: AvatarVariantOptionButtonProps) {
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
        <Avatar selection={previewSelection} id="s2" />
      </span>
    </button>
  );
}
