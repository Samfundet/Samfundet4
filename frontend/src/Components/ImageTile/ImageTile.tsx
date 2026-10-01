import classNames from 'classnames';
import type { ImageDto } from '~/dto';
import { backgroundImageFromUrl, imageUrl } from '~/utils';
import { Link } from '../Link';
import styles from './ImageTile.module.scss';

type ImageTileProps = {
  image: ImageDto;
  className?: string;
  selected?: boolean;
  /** Renders the tile as a link. Takes precedence over onClick. */
  url?: string;
  onClick?(): void;
};

// Keeps busy tags from covering the image; the rest collapse into a "+N" chip.
const MAX_VISIBLE_TAGS = 3;

function TileContent({ image }: Pick<ImageTileProps, 'image'>) {
  const visibleTags = image.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = image.tags.slice(MAX_VISIBLE_TAGS);

  return (
    <div className={styles.imageTitle}>
      <p className={styles.text}>{image.title}</p>
      {image.tags.length > 0 && (
        <div className={styles.tags}>
          {visibleTags.map((tag) => (
            <span key={tag.id} className={styles.tag}>
              {tag.name}
            </span>
          ))}
          {hiddenTags.length > 0 && (
            <span
              className={classNames(styles.tag, styles.tagOverflow)}
              title={hiddenTags.map((tag) => tag.name).join(', ')}
            >
              +{hiddenTags.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function ImageTile({ image, className, selected = false, url, onClick }: ImageTileProps) {
  const tileClassName = classNames(
    styles.imageContainer,
    className,
    selected && styles.selected,
    (url !== undefined || onClick !== undefined) && styles.clickable,
  );

  const bgUrl = imageUrl(image, 'small');

  if (url !== undefined) {
    return (
      <Link url={url} plain={true} className={tileClassName} style={backgroundImageFromUrl(bgUrl)}>
        <TileContent image={image} />
      </Link>
    );
  }

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
