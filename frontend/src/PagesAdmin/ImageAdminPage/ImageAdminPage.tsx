import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputField } from '~/Components';
import { PagedPagination } from '~/Components/Pagination';
import { getImagesPaginated } from '~/api';
import type { ImageDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageAdminPage.module.scss';
import { AdminImage } from './components';

const PAGE_SIZE = 20;

export function ImageAdminPage() {
  const [images, setImages] = useState<ImageDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true); // Prevents reaload of whole page on querry changes
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
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

  // Fetch images when page or search changes
  useEffect(() => {
    if (isInitialLoad) {
      setShowSpinner(true);
    }
    getImagesPaginated(currentPage, PAGE_SIZE, debouncedSearch || undefined)
      .then((data) => {
        setImages(data.results);
        setTotalCount(data.count);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (isInitialLoad) {
          setIsInitialLoad(false);
          setShowSpinner(false);
        }
      });
  }, [currentPage, debouncedSearch, isInitialLoad]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
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
