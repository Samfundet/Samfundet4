import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getGangsRecruitment } from '~/api';
import { GangRecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentGangOverviewPage() {
  const recruitmentId = useParams().recruitmentId;
  const [allGangs, setAllGangs] = useState<GangRecruitmentDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (recruitmentId) {
      getGangsRecruitment(recruitmentId).then((data) => {
        setAllGangs(data);
        setShowSpinner(false);
      });
    }
  }, [recruitmentId]);

  const tableColumns = [
    { content: t(KEY.common_gang), sortable: true },
    { content: t(KEY.recruitment_positions), sortable: true },
  ];

  // TODO: Only show gangs that user has access to, and only show gangs that are recruiting
  const data = allGangs.map(function (gang) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gang.id },
    });

    return [{ content: <Link url={pageUrl}>{dbT(gang, 'name')}</Link> }, gang.recruitment_positions.length];
  });

  const title = t(KEY.admin_information_manage_title);
  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <>
      <Button theme="success" rounded={true} link={ROUTES.frontend.admin_information_create}>
        {t(KEY.common_overview)}
      </Button>
      <Button theme="blue" rounded={true} link={ROUTES.frontend.admin_recruitment_users_without_interview}>
        {t(KEY.recruitment_show_applicants_without_interview)}
      </Button>
      <Button theme="white" rounded={true} link={ROUTES.frontend.admin_information_create}>
        {t(KEY.recruitment_show_unprocessed_applicants)}
      </Button>
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner} showBackButton={true}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
