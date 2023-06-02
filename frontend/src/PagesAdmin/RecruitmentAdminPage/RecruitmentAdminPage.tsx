import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { getFormattedDate } from '~/Components/ExpandableList/utils';
import { Table } from '~/Components/Table';
import { getAllRecruitments } from '~/api';
import { RecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentAdminPage() {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState<RecruitmentDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  //TODO add permissions on render
  useEffect(() => {
    getAllRecruitments()
      .then((data) => {
        setRecruitments(data.data);
        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
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
      pattern: ROUTES.frontend.information_page_detail,
      urlParams: { slugField: element.id },
    });

    return [
      { content: <Link url={pageUrl}>{dbT(element, 'name')}</Link>, value: pageUrl },
      element.organization,
      `${getFormattedDate(element.visible_from)}-${getFormattedDate(element.reprioritization_deadline_for_groups)}`,
      {
        content: (
          <CrudButtons
            onView={() => {
              navigate(pageUrl);
            }}
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_information_edit,
                  urlParams: { slugField: element.id },
                }),
              );
            }}
          />
        ),
      },
    ];
  });

  const title = t(KEY.admin_information_manage_title);
  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_information_create)}>
      {t(KEY.common_create)} {t(KEY.information_page_short)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
