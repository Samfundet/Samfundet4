import { Icon } from '@iconify/react';
import classNames from 'classnames';
import type { TagDto } from '~/dto';
import styles from './TagChip.module.scss';

type TagChipProps = {
  tag: TagDto;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
};

// Black or white depending on the perceived brightness of the background color
function contrastColor(hexColor?: string | null): string | undefined {
  if (!hexColor || hexColor.length !== 6) return undefined;
  const r = Number.parseInt(hexColor.slice(0, 2), 16);
  const g = Number.parseInt(hexColor.slice(2, 4), 16);
  const b = Number.parseInt(hexColor.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#000000' : '#ffffff';
}

export function TagChip({ tag, active, onClick, onRemove, className }: TagChipProps) {
  const content = (
    <>
      <span className={styles.label}>{tag.image_count != null ? `${tag.name} (${tag.image_count})` : tag.name}</span>
      {onRemove && (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label={`Remove ${tag.name}`}>
          <Icon icon="mdi:close" />
        </button>
      )}
    </>
  );

  const style = tag.color ? { backgroundColor: `#${tag.color}`, color: contrastColor(tag.color) } : undefined;
  const chipClass = classNames(styles.chip, active && styles.active, className);

  if (onClick) {
    return (
      <button type="button" className={chipClass} style={style} onClick={onClick}>
        {content}
      </button>
    );
  }
  return (
    <span className={chipClass} style={style}>
      {content}
    </span>
  );
}
