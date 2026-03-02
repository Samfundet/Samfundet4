import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PagedPagination } from '~/Components/Pagination';
import { getImages, getImagesPaginated } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { backgroundImageFromUrl } from '~/utils';
import styles from './ImagePicker.module.scss';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { imageKeys } from '~/queryKeys';

export type ImagePickerProps = {
  onSelected?(image: ImageDto): void;
  selectedImage?: ImageDto;
};

const PAGE_SIZE = 15;

export function ImagePicker({ onSelected, selectedImage }: ImagePickerProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ImageDto | undefined>(selectedImage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setSelected(selectedImage);
  }, [selectedImage]);

  const { data, isError } = useQuery({
    queryKey: imageKeys.list(currentPage, undefined),
    queryFn: () => getImagesPaginated(currentPage, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
  
  const images = data?.results ?? [];
  const totalCount = data?.count ?? 0;

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

  return (
    <div className={styles.container}>
      <div className={styles.selected_container}>
        {selected && <h1 className={styles.image_title}>{selected.title}</h1>}
        <div
          className={styles.selected}
          style={backgroundImageFromUrl(selected?.url ? BACKEND_DOMAIN + selected.url : undefined)}
        >
          {selected === undefined && (
            <>
              <Icon icon="ic:outline-image" width={24} />
              <p>{t(KEY.admin_no_image_selected)}</p>
            </>
          )}
        </div>
        {isError && (
          <p style={{ marginTop: '1rem' }}>{t(KEY.common_something_went_wrong)}</p>
        )}
        {/* TODO tags and other metadata */}
      </div>
      <div>
      <div className={styles.image_container}>
        {images.map(renderImage)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <PagedPagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
      </div>
    </div>
  );
}
