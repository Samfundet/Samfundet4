import classNames from 'classnames';
import type { ImageDto } from '~/dto';
import { backgroundImageFromUrl, imageUrl } from '~/utils';
import styles from './ImageTile.module.scss';

type ImageTileProps = {
  image: ImageDto;
  className?: string;
  selected?: boolean;
  onClick?(): void;
};

function TileContent({ image }: Pick<ImageTileProps, 'image'>) {
  return (
    <div className={styles.imageTitle}>
      <p className={styles.text}>{image.title}</p>
      {image.tags.length > 0 && (
        <div className={styles.tags}>
          {image.tags.map((tag) => (
            <span key={tag.id} className={styles.tag}>
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImageTile({ image, className, selected = false, onClick }: ImageTileProps) {
  const tileClassName = classNames(
    styles.imageContainer,
    className,
    selected && styles.selected,
    onClick && styles.clickable,
  );

  const bgUrl = imageUrl(image, 'small');

  if (onClick !== undefined) {
    return (
      <button
        type="button"
        aria-label={`Select ${image.title}`}
        className={tileClassName}
        style={backgroundImageFromUrl(bgUrl)}
        onClick={onClick}
      >
        <TileContent image={image} />
      </button>
    );
  }

  return (
    <div className={tileClassName} style={backgroundImageFromUrl(bgUrl)}>
      <TileContent image={image} />
    </div>
  );
}
