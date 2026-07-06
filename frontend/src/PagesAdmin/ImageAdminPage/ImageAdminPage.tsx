import { Icon } from '@iconify/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Button, Input, TagChip } from '~/Components';
import { PagedPagination } from '~/Components/Pagination';
import { getImagesPaginated, getPopularTags } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { imageKeys, tagKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { hasPermissions, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageAdminPage.module.scss';
import { AdminImage } from './components';

const PAGE_SIZE = 20;

export function ImageAdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = searchParams.get('search') ?? '';
  const selectedTag = searchParams.get('tag') ?? undefined;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>(debouncedSearch);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout>>();
  const { t } = useTranslation();
  useTitle(t(KEY.admin_images_title));

  const { user } = useAuthContext();

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_IMAGE], undefined, true);

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          if (searchInput) {
            next.set('search', searchInput);
          } else {
            next.delete('search');
          }
          return next;
        },
        { replace: true },
      );
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchInput, setSearchParams]);

  useEffect(() => {
    setSearchInput(debouncedSearch);
  }, [debouncedSearch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to trigger on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedTag]);

  const { data, isLoading } = useQuery({
    queryKey: imageKeys.list(currentPage, debouncedSearch || undefined, selectedTag),
    queryFn: () => getImagesPaginated(currentPage, PAGE_SIZE, debouncedSearch || undefined, selectedTag),
    placeholderData: keepPreviousData,
  });

  const { data: popularTags } = useQuery({ queryKey: tagKeys.popular(), queryFn: getPopularTags });

  const images = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  const title = t(KEY.admin_images_title);
  const backendUrl = ROUTES.backend.admin__samfundet_image_changelist;
  const header = canCreate ? (
    <Button theme="primary" link={ROUTES.frontend.admin_images_create}>
      <Icon icon="lucide:plus" />
      {lowerCapitalize(t(KEY.admin_images_create))}
    </Button>
  ) : undefined;

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleTagClick = useCallback(
    (tagName: string) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        if (next.get('tag') === tagName) {
          next.delete('tag');
        } else {
          next.set('tag', tagName);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <div className={styles.action_row}>
        <Input
          type="text"
          icon="mdi:search"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t(KEY.common_search)}
        />
      </div>
      {popularTags && popularTags.length > 0 && (
        <div className={styles.tagRow}>
          {popularTags.map((tag) => (
            <TagChip
              key={tag.id}
              tag={tag}
              active={selectedTag === tag.name}
              onClick={() => handleTagClick(tag.name)}
            />
          ))}
        </div>
      )}
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
