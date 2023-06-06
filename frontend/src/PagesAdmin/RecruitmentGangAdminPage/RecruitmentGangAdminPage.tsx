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
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentGangAdminPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const navigate = useNavigate();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    recruitmentId &&
      getRecruitmentPositions(recruitmentId).then((data) => {
        // TODO: Make this filtering happen on the backend
        setRecruitmentPositions(data.data.filter((recruitment) => recruitment.gang == gangId));
        setShowSpinner(false);
      });
  }, [recruitmentId, gangId]);

  const tableColumns = [{ content: t(KEY.recruitment_position), sortable: true }];

  const data = recruitmentPositions.map(function (recruitmentPosition) {
    return [
      { content: <Link url={ROUTES.frontend.health}>{dbT(recruitmentPosition, 'name')}</Link> },
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
    <Button
      theme="success"
      rounded={true}
      onClick={() => navigate(ROUTES.frontend.admin_recruitment_gang_position_create)}
    >
      {t(KEY.common_create)} {t(KEY.recruitment_position)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
