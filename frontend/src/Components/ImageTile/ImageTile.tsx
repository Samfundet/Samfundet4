import classNames from 'classnames';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { backgroundImageFromUrl } from '~/utils';
import styles from './ImageTile.module.scss';

type ImageTileProps = {
  image: ImageDto;
  className?: string;
  selected?: boolean;
  selectedClassName?: string;
  onClick?(): void;
};

function TileContent({ image }: Pick<ImageTileProps, 'image'>) {
  const imageTags = image.tags.map((tag) => ` ${tag.name}`).toString();

  return (
    <>
      <div className={styles.imageTitle}>
        <p className={styles.text}>{image.title}</p>
        <p className={styles.tags}>{imageTags}</p>
      </div>
    </>
  );
}

export function ImageTile({ image, className, selected = false, selectedClassName, onClick }: ImageTileProps) {
  const tileClassName = classNames(
    styles.imageContainer,
    className,
    selected && styles.selected,
    selected && selectedClassName,
    onClick && styles.clickable,
  );

  if (onClick !== undefined) {
    return (
      <button
        type="button"
        className={tileClassName}
        style={backgroundImageFromUrl(BACKEND_DOMAIN + image.url)}
        onClick={onClick}
      >
        <TileContent image={image} />
      </button>
    );
  }

  return (
    <div className={tileClassName} style={backgroundImageFromUrl(BACKEND_DOMAIN + image.url)}>
      <TileContent image={image} />
    </div>
  );
}
