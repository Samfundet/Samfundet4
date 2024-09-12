import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { Button, Link, OccupiedFormModal } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentGangs } from '~/api';
import { type RecruitmentGangDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { RecruitmentLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentGangOverviewPage() {
  const { recruitment } = useRouteLoaderData('recruitment') as RecruitmentLoader;
  const { recruitmentId } = useParams();
  const [gangs, setGangs] = useState<RecruitmentGangDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const title = dbT(recruitment, 'name') || t(KEY.common_unknown);
  useTitle(title);

  useEffect(() => {
    if (!recruitment?.id) {
      return;
    }
    getRecruitmentGangs(recruitment.id).then((data) => {
      setGangs(data);
      setLoading(false);
    });
  }, [recruitment]);

  const tableColumns = [
    { content: t(KEY.common_gang), sortable: true },
    { content: t(KEY.recruitment_positions), sortable: true },
  ];

  // TODO: Only show gangs that user has access to, and only show gangs that are recruiting. ISSUE #1121
  const data = gangs.map(function (gang) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gang.id },
    });

    return [{ content: <Link url={pageUrl}>{dbT(gang, 'name')}</Link> }, gang.recruitment_positions];
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
        theme="samf"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_users_three_interview_criteria,
          urlParams: {
            recruitmentId: recruitmentId,
          },
        })}
      >
        {t(KEY.recruitment_three_interviews_criteria_button)}
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
      <Button
        theme="white"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_show_unprocessed_applicants,
          urlParams: { recruitmentId },
        })}
      >
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
      {recruitmentId && <OccupiedFormModal recruitmentId={parseInt(recruitmentId)} isButtonRounded={true} />}
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={loading}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
