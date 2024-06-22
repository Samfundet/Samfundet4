import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getGangs } from '~/api';
import { GangDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import type { RecruitmentLoader } from '~/AppRoutes';

export function RecruitmentGangOverviewPage() {
  const { recruitment } = useRouteLoaderData('recruitment') as RecruitmentLoader;
  const { recruitmentId } = useParams();
  const [allGangs, setAllGangs] = useState<GangDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    getGangs().then((data) => {
      setAllGangs(data);
      setShowSpinner(false);
    });
  }, []);

  const tableColumns = [{ content: t(KEY.common_gang), sortable: true }];

  // TODO: Only show gangs that user has access to, and only show gangs that are recruiting
  const data = allGangs.map(function (gang) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gang.id },
    });

    return [{ content: <Link url={pageUrl}>{dbT(gang, 'name')}</Link> }];
  });

  const title = dbT(recruitment, 'name') || t(KEY.common_unknown);
  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <>
      <Button theme="success" rounded={true} link={ROUTES.frontend.admin_information_create}>
        {t(KEY.common_overview)}
      </Button>
      <Button
        theme="blue"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_users_without_interview,
          urlParams: { recruitmentId },
        })}
      >
        {t(KEY.recruitment_show_applicants_without_interview)}
      </Button>
      <Button theme="white" rounded={true} link={ROUTES.frontend.admin_information_create}>
        {t(KEY.recruitment_show_unprocessed_applicants)}
      </Button>
      <Button
        theme="white"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_edit,
          urlParams: { recruitmentId },
        })}
      >
        {t(KEY.common_edit)}
      </Button>
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner} showBackButton={true}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
