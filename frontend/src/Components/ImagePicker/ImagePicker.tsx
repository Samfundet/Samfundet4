import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { getImages } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import type { Children } from '~/types';
import { backgroundImageFromUrl } from '~/utils';
import styles from './ImagePicker.module.scss';

export type ImagePickerProps = {
  onSelected?(image: ImageDto): void;
};

export function ImagePicker({ onSelected }: ImagePickerProps) {
  const [selected, setSelected] = useState<ImageDto>();
  const [images, setImages] = useState<ImageDto[]>([]);

  useEffect(() => {
    getImages()
      .then((imgs) => setImages(imgs))
      .catch(() => console.error);
  }, []);

  function select(image: ImageDto) {
    setSelected(image);
    onSelected?.(image);
  }

  function renderImage(image: ImageDto): Children {
    const isSelected = selected?.id === image.id;
    return (
      <div
        key={image.id}
        className={classNames(styles.image, isSelected && styles.selected_image)}
        onClick={() => select(image)}
        style={backgroundImageFromUrl(BACKEND_DOMAIN + image.url)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.selected_container}>
        {selected && (
          <>
            <h1 className={styles.image_title}>{selected.title}</h1>
          </>
        )}
        <div className={styles.selected} style={backgroundImageFromUrl(BACKEND_DOMAIN + selected?.url)}>
          {selected === undefined && (
            <>
              <Icon icon="ic:outline-image" width={24} />
              <p>Ingen bilde valgt</p>
            </>
          )}
        </div>
        {/* TODO tags and other metadata */}
      </div>
      <div className={styles.image_container}>{images.map((image) => renderImage(image))}</div>
    </div>
  );
}
