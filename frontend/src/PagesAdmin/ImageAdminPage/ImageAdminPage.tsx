import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputField } from '~/Components';
import { PagedPagination } from '~/Components/Pagination';
import { getImagesPaginated } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { imageKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageAdminPage.module.scss';
import { AdminImage } from './components';

const PAGE_SIZE = 20;

export function ImageAdminPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const { t } = useTranslation();
  useTitle(t(KEY.admin_images_title));

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
  const { data, isLoading } = useQuery({
    queryKey: imageKeys.list(currentPage, debouncedSearch || undefined),
    queryFn: () => getImagesPaginated(currentPage, PAGE_SIZE, debouncedSearch || undefined),
    placeholderData: keepPreviousData,
  });

  const images = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  const title = t(KEY.admin_images_title);
  const backendUrl = ROUTES.backend.admin__samfundet_image_changelist;
  const header = (
    <Button theme="success" rounded={true} link={ROUTES.frontend.admin_images_create}>
      {lowerCapitalize(t(KEY.admin_images_create))}
    </Button>
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <div className={styles.action_row}>
        <InputField
          icon="mdi:search"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder={t(KEY.common_search)}
        />
      </div>
      <div className={styles.imageContainer}>
        {images.map((element) => (
          <AdminImage key={element.id} image={element} className={styles.imageBox} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <PagedPagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminPageLayout>
  );
}
