import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, CrudButtons, Link } from '~/Components';
import { getFormattedDate } from '~/Components/ExpandableList/utils';
import { Table } from '~/Components/Table';
import { getAllRecruitments } from '~/api';
import { RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentAdminPage() {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState<RecruitmentDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const title = t(KEY.recruitment_administrate);
  useTitle(title);

  // Stuff to do on first render.
  //TODO add permissions on render
  useEffect(() => {
    getAllRecruitments()
      .then((data) => {
        setRecruitments(data.data);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      })
      .finally(() => setShowSpinner(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.recruitment_organization), sortable: true },
    { content: t(KEY.recruitment_duration), sortable: true },
    '', // Buttons
  ];

  const data = recruitments.map(function (element) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_overview,
      urlParams: { recruitmentId: element.id },
    });
    return [
      {
        content: <Link url={pageUrl}>{dbT(element, 'name')}</Link>,
        value: ROUTES.frontend.recruitment,
      },
      typeof element.organization !== 'number' ? element.organization.name : element.organization,
      `${getFormattedDate(element.visible_from)}-${getFormattedDate(element.reprioritization_deadline_for_groups)}`,
      {
        content: (
          <CrudButtons
            onView={() => {
              navigate(ROUTES.frontend.recruitment);
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
    ];
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
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
