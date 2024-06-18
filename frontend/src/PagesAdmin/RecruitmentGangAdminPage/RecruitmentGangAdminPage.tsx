import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CrudButtons, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentPositions } from '~/api';
import { RecruitmentPositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentGangAdminPage() {
  const { recruitmentId, gangId } = useParams();
  const navigate = useNavigate();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    recruitmentId &&
      getRecruitmentPositions(recruitmentId).then((data) => {
        // TODO: Make this filtering happen on the backend
        setRecruitmentPositions(data.data.filter((recruitment) => recruitment.gang.id.toString() == gangId));
        setShowSpinner(false);
      });
  }, [recruitmentId, gangId]);

  const tableColumns = [{ content: t(KEY.recruitment_position), sortable: true }];

  const data = recruitmentPositions.map(function (recruitmentPosition) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gangId, positionId: recruitmentPosition.id },
    });
    return [
      {
        content: <Link url={pageUrl}>{dbT(recruitmentPosition, 'name')}</Link>,
      },
      {
        content: (
          <CrudButtons
            onView={() => {
              navigate(ROUTES.frontend.recruitment);
            }}
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_recruitment_gang_position_edit,
                  urlParams: {
                    gangId: gangId,
                    recruitmentId: recruitmentId,
                    positionId: recruitmentPosition.id,
                  },
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
    <>
      <Button
        theme="success"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_gang_position_create,
          urlParams: {
            gangId: gangId,
            recruitmentId: recruitmentId,
          },
        })}
      >
        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.recruitment_position)}`)}
      </Button>
      <Button
        theme="outlined"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_gang_all_admissions,
          urlParams: {
            gangId: gangId,
            recruitmentId: recruitmentId,
          },
        })}
      >
        {lowerCapitalize(`${t(KEY.recruitment_all_admissions)}`)}
      </Button>
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner} showBackButton={true}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
