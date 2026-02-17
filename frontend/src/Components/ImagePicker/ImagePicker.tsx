import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getImages } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { backgroundImageFromUrl } from '~/utils';
import { ImageQuery } from '../ImageQuery/ImageQuery';
import { PagedPagination } from '../Pagination';
import styles from './ImagePicker.module.scss';

const PAGE_SIZE = 12;

export type ImagePickerProps = {
  onSelected?(image: ImageDto): void;
  selectedImage?: ImageDto;
};

export function ImagePicker({ onSelected, selectedImage }: ImagePickerProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ImageDto | undefined>(selectedImage);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [allImages, setAllImages] = useState<ImageDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getImages()
      .then((imgs) => {
        setImages(imgs);
        setAllImages(imgs);
      })
      .catch(() => console.error);
  }, []);

  // Reset to page 1 when filtered images change
  useEffect(() => {
    setCurrentPage(1);
  }, [images]);

  function select(image: ImageDto) {
    setSelected(image);
    onSelected?.(image);
  }

  function renderImage(image: ImageDto): ReactNode {
    const isSelected = selected?.id === image.id;
    return (
      <button
        type="button"
        key={image.id}
        className={classNames(styles.image, isSelected && styles.selected_image)}
        onClick={() => select(image)}
        style={backgroundImageFromUrl(BACKEND_DOMAIN + image.url)}
      />
    );
  }

  // Calculate paginated images
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayImages = images.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.selected_container}>
        {selected && <h1 className={styles.image_title}>{selected.title}</h1>}
        <div className={styles.selected} style={backgroundImageFromUrl(BACKEND_DOMAIN + selected?.url)}>
          {selected === undefined && (
            <>
              <Icon icon="ic:outline-image" width={24} />
              <p>{t(KEY.admin_no_image_selected)}</p>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <ImageQuery allImages={allImages} setImages={setImages} />
        <div className={styles.image_container}>{displayImages.map((image) => renderImage(image))}</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <PagedPagination
            currentPage={currentPage}
            totalItems={images.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
