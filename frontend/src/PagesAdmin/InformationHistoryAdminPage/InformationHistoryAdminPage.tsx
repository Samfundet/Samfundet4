import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';
import { Button, SamfundetLogoSpinner } from '~/Components';
import { Table } from '~/Components/Table';
import { useGetAdminInfoPageHistory, useGetAdminInfoPageRevision } from '~/domain';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMDWithTime } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InformationHistoryAdminPage.module.scss';
import { RevisionContent } from './components';

const VERSION_PARAM = 'version';

export function InformationHistoryAdminPage() {
  const { t } = useTranslation();
  const { slugField } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const slug = slugField ?? '';
  const title = `${t(KEY.admin_information_history_title)}: ${slug}`;
  useTitle(title);

  const rawVersion = Number(searchParams.get(VERSION_PARAM));
  const selectedVersion = Number.isInteger(rawVersion) && rawVersion > 0 ? rawVersion : undefined;

  const { data: revisions, isLoading } = useGetAdminInfoPageHistory(slug);
  const { data: revision, isLoading: isLoadingRevision } = useGetAdminInfoPageRevision(slug, selectedVersion);

  const selectedIndex = revisions?.findIndex((entry) => entry.version === selectedVersion) ?? -1;
  const previousVersion = selectedIndex >= 0 ? revisions?.[selectedIndex + 1]?.version : undefined;

  const {
    data: previousRevision,
    isLoading: isLoadingPrevious,
    isError: previousFailed,
  } = useGetAdminInfoPageRevision(slug, previousVersion);

  function selectVersion(version: number) {
    setSearchParams({ [VERSION_PARAM]: String(version) });
  }

  const tableColumns = [
    { content: t(KEY.common_version), sortable: true },
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.common_created_by), sortable: true },
    { content: t(KEY.common_date), sortable: true },
  ];

  const tableData = revisions?.map((entry) => ({
    cells: [
      {
        value: entry.version,
        content: (
          <Button
            type="button"
            theme={entry.version === selectedVersion ? 'primary' : 'secondary'}
            onClick={() => selectVersion(entry.version)}
          >
            {`v${entry.version}`}
          </Button>
        ),
      },
      entry.title_nb ?? entry.title_en ?? '',
      entry.created_by ?? '',
      {
        value: entry.created_at,
        content: formatDateYMDWithTime(new Date(entry.created_at)),
      },
    ],
  }));

  return (
    <AdminPageLayout title={title} loading={isLoading}>
      {revisions?.length === 0 ? (
        <p className={styles.empty}>{t(KEY.admin_information_history_empty)}</p>
      ) : (
        <Table columns={tableColumns} data={tableData ?? []} />
      )}

      {selectedVersion === undefined && !!revisions?.length && (
        <p className={styles.empty}>{t(KEY.admin_information_history_select)}</p>
      )}

      {(isLoadingRevision || isLoadingPrevious) && <SamfundetLogoSpinner />}
      {!isLoadingRevision && !isLoadingPrevious && revision && (
        <RevisionContent revision={revision} previousRevision={previousRevision} previousFailed={previousFailed} />
      )}
    </AdminPageLayout>
  );
}
