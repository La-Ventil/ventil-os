import type { MouseEventHandler } from 'react';
import styles from './avatar-color-option-button.module.css';

type AvatarColorOptionButtonProps = {
  colorId: string;
  selected: boolean;
  ariaLabel: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function AvatarColorOptionButton({
  colorId,
  selected,
  ariaLabel,
  onClick
}: AvatarColorOptionButtonProps) {
  return (
    <button
      type="button"
      className={styles.colorButton}
      data-active={selected ? 'true' : 'false'}
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={styles.colorSwatch} style={{ backgroundColor: `var(--${colorId})` }} />
    </button>
  );
}
