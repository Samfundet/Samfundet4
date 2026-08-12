import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button, Link } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { useAuthContext } from '~/context/AuthContext';
import { useGetAdminInfoPages, useInfoPageMutations } from '~/domain';
import type { InformationPageDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import {
  dbT,
  formatDateYMDWithTime,
  formatGangName,
  formatSectionName,
  hasPermissions,
  lowerCapitalize,
} from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InformationAdminPage.module.scss';

function formatOwnerName(page: InformationPageDto): string {
  if (page.section) {
    return formatSectionName(page.section, page.gang, page.organization);
  }
  if (page.gang) {
    return formatGangName(page.gang, page.organization);
  }
  return ''; // should never get to this point
}

export function InformationAdminPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.admin_information_manage_title));

  const { user } = useAuthContext();
  const { data, isLoading } = useGetAdminInfoPages();
  const { deleteInfoPage } = useInfoPageMutations();

  const tableColumns = [
    '', // Visibility icon
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.owner), sortable: true },
    { content: t(KEY.last_updated), sortable: true },
    '', // Buttons
  ];

  const tableData = data?.map((element) => {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.information_page_detail,
      urlParams: { slugField: element.slug_field },
    });

    let lastUpdated = '';
    if (element.updated_at) {
      lastUpdated = formatDateYMDWithTime(new Date(element.updated_at));
    } else if (element.created_at) {
      lastUpdated = formatDateYMDWithTime(new Date(element.created_at));
    }

    return {
      cells: [
        {
          content: (
            <Icon
              icon={element.visible ? 'material-symbols:public' : 'material-symbols:public-off-rounded'}
              className={element.visible ? styles.visible : styles.not_visible}
            />
          ),
        },
        {
          content: element.visible ? <Link url={pageUrl}>{pageUrl}</Link> : <span>{pageUrl}</span>,
          value: pageUrl,
        },
        dbT(element, 'title'),
        formatOwnerName(element),
        {
          value: lastUpdated,
          content: (
            <Link
              url={reverse({
                pattern: ROUTES.frontend.admin_information_history,
                urlParams: { slugField: element.slug_field },
              })}
              title={t(KEY.admin_information_history_title)}
            >
              {lastUpdated}
            </Link>
          ),
        },
        {
          content: (
            <CrudButtons
              onView={element.visible && pageUrl}
              onEdit={
                hasPermissions(user, [PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE], element, true) &&
                reverse({
                  pattern: ROUTES.frontend.admin_information_edit,
                  urlParams: { slugField: element.slug_field },
                })
              }
              onDelete={
                hasPermissions(user, [PERM.SAMFUNDET_DELETE_INFORMATIONPAGE], element, true) &&
                (() => {
                  if (window.confirm(t(KEY.admin_information_confirm_delete) ?? '')) {
                    deleteInfoPage.mutate(element.slug_field);
                  }
                })
              }
            />
          ),
        },
      ],
    };
  });

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_INFORMATIONPAGE], undefined, true);

  const title = t(KEY.admin_information_manage_title);
  const header = canCreate && (
    <Button theme="primary" link={ROUTES.frontend.admin_information_create}>
      <Icon icon="mdi:file-document-plus-outline" />
      {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.information_page_short)}`)}
    </Button>
  );

  return (
    <AdminPageLayout
      title={title}
      backendUrl={ROUTES.backend.admin__samfundet_informationpage_changelist}
      header={header}
      loading={isLoading}
    >
      <Table columns={tableColumns} data={tableData || []} />
    </AdminPageLayout>
  );
}
