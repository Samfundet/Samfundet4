import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, CrudButtons, DrfPagination, Link } from '~/Components';
import { getFormattedDate } from '~/Components/ExpandableList/utils';
import { Table } from '~/Components/Table';
import { getAllRecruitments } from '~/api';
import { PAGE_SIZE } from '~/constants';
import { usePaginatedQuery, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentAdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t(KEY.recruitment_administrate);
  useTitle(title);

  // Stuff to do on first render.
  //TODO add permissions on render
  const {
    data: recruitments,
    totalItems,
    currentPage,
    setCurrentPage,
    isLoading,
  } = usePaginatedQuery({
    queryKey: ['admin-recruitments'],
    queryFn: getAllRecruitments,
    pageSize: PAGE_SIZE,
  });

  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.recruitment_organization), sortable: true },
    { content: t(KEY.recruitment_duration), sortable: true },
    '', // Buttons
  ];

  const data = recruitments.map((element) => {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_overview,
      urlParams: { recruitmentId: element.id },
    });
    return {
      cells: [
        {
          content: <Link url={pageUrl}>{dbT(element, 'name')}</Link>,
          value: element.id,
        },
        {
          content: getObjectFieldOrNumber<string>(element?.organization, 'name'),
        },
        {
          content: `${getFormattedDate(element.visible_from)}-${getFormattedDate(
            element.reprioritization_deadline_for_groups,
          )}`,
        },
        {
          content: (
            <CrudButtons
              onManage={() => {
                navigate(
                  reverse({
                    pattern: ROUTES.frontend.admin_recruitment_recruiter_dashboard,
                    urlParams: { recruitmentId: element.id },
                  }),
                );
              }}
              onView={() => {
                navigate(
                  reverse({
                    pattern: ROUTES.frontend.organization_recruitment,
                    urlParams: { recruitmentId: element.id },
                  }),
                );
              }}
              onEdit={() => {
                navigate(
                  reverse({
                    pattern: ROUTES.frontend.admin_recruitment_edit,
                    urlParams: { recruitmentId: element.id },
                  }),
                );
              }}
            />
          ),
        },
      ],
    };
  });

  const backendUrl = ROUTES.backend.admin__samfundet_recruitment_changelist;
  const header = (
    <>
      <Button theme="success" rounded={true} link={ROUTES.frontend.admin_recruitment_create}>
        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_recruitment)}`)}
      </Button>
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      {totalItems > PAGE_SIZE && (
        <DrfPagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          buttonTheme="samf"
          navButtonTheme="samf"
          buttonDisplay="pill"
        />
      )}
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
