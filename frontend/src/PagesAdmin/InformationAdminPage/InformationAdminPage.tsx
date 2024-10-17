import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button, Link } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { deleteInformationPage, getInformationPages } from '~/api';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function InformationAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  useTitle(t(KEY.admin_information_manage_title));

  // TODO: add permissions on render
  const { data, isLoading } = useQuery({
    queryKey: ['informationpages'],
    queryFn: getInformationPages,
  });

  const deletePageMutation = useMutation({
    mutationFn: (slug: string) => {
      // if (!slug) return; // TODO: raise err
      return deleteInformationPage(slug);
    },
  });

  const tableColumns = [
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

    return [
      { content: <Link url={pageUrl}>{pageUrl}</Link>, value: pageUrl },
      dbT(element, 'title'),
      'To be added',
      'To be added',
      {
        content: (
          <CrudButtons
            onView={() => {
              navigate({ url: pageUrl });
            }}
            onEdit={() => {
              navigate({
                url: reverse({
                  pattern: ROUTES.frontend.admin_information_edit,
                  urlParams: { slugField: element.slug_field },
                }),
              });
            }}
            onDelete={() => {
              if (window.confirm(t(KEY.admin_information_confirm_delete) ?? '')) {
                deletePageMutation.mutate(element.slug_field);
              }
            }}
          />
        ),
      },
    ];
  });

  const title = t(KEY.admin_information_manage_title);
  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <Button theme="success" rounded={true} link={ROUTES.frontend.admin_information_create}>
      {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.information_page_short)}`)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <Table columns={tableColumns} data={tableData || []} />
    </AdminPageLayout>
  );
}
