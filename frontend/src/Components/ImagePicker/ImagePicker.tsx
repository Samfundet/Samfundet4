import { Icon } from '@iconify/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getImagesPaginated } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { imageKeys } from '~/queryKeys';
import { backgroundImageFromUrl } from '~/utils';
import { InputField } from '../InputField';
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout>();

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchInput]);

  // Reset to page 1 when search changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to trigger on debouncedSearch change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch images using React Query
  const { data } = useQuery({
    queryKey: imageKeys.list(currentPage, debouncedSearch || undefined),
    queryFn: () => getImagesPaginated(currentPage, PAGE_SIZE, debouncedSearch || undefined),
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

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

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
      <div className={styles.search_wrapper}>
        <InputField
          icon="mdi:search"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder={t(KEY.common_search)}
        />
        <div className={styles.image_container}>{images.map((image) => renderImage(image))}</div>
        <div className={styles.pagination_wrapper}>
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
