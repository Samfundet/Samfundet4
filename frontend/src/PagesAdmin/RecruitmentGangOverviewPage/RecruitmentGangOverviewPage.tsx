import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getGangs, getGangsByOrganization } from '~/api';
import { GangDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import type { RecruitmentLoader } from '~/router/loaders';

export function RecruitmentGangOverviewPage() {
  const { recruitment } = useRouteLoaderData('recruitment') as RecruitmentLoader;
  const { recruitmentId } = useParams();
  const [gangs, setGangs] = useState<GangDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const title = dbT(recruitment, 'name') || t(KEY.common_unknown);
  useTitle(title);

  useEffect(() => {
    if (!recruitment?.organization) {
      return;
    }
    getGangsByOrganization(recruitment.organization).then((data) => {
      setGangs(data);
      setLoading(false);
    });
  }, []);

  const tableColumns = [{ content: t(KEY.common_gang), sortable: true }];

  // TODO: Only show gangs that user has access to, and only show gangs that are recruiting. ISSUE #1121
  const data = gangs.map(function (gang) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gang.id },
    });

    return [{ content: <Link url={pageUrl}>{dbT(gang, 'name')}</Link> }];
  });

  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <>
      <Button
        theme="success"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_overview,
          urlParams: { recruitmentId },
        })}
      >
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
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={loading}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
