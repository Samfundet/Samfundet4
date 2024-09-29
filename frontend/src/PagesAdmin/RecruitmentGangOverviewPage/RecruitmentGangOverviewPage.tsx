import { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, CrudButtons, Link, OccupiedFormModal, type Tab, TabView } from '~/Components';
import { Table } from '~/Components/Table';
import { deleteRecruitmentSeparatePosition, getRecruitment, getRecruitmentGangs } from '~/api';
import type { RecruitmentDto, RecruitmentGangDto, RecruitmentSeparatePositionDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentGangOverviewPage() {
  const { recruitmentId } = useParams();
  const navigate = useCustomNavigate();
  const [gangs, setGangs] = useState<RecruitmentGangDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const title = dbT(recruitment, 'name') || t(KEY.common_unknown);
  useTitle(title);

  useEffect(() => {
    if (!recruitmentId) {
      return;
    }
    Promise.all([
      getRecruitmentGangs(recruitmentId).then((data) => {
        setGangs(data);
      }),
      getRecruitment(recruitmentId).then((response) => {
        setRecruitment(response.data);
      }),
    ]).then(() => {
      setLoading(false);
    });
  }, [recruitmentId]);

  const tableGangColumns = [
    { content: t(KEY.common_gang), sortable: true },
    { content: t(KEY.recruitment_positions), sortable: true },
  ];

  // TODO: Only show gangs that user has access to, and only show gangs that are recruiting. ISSUE #1121
  const tableGangData = gangs.map((gang) => {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gang.id },
    });

    return [{ content: <Link url={pageUrl}>{dbT(gang, 'name')}</Link> }, gang.recruitment_positions];
  });

  const tableSeparatePositionColumns = [
    { content: t(KEY.common_gang), sortable: true },
    { content: t(KEY.common_url), sortable: true },
    { content: t(KEY.common_administrate), sortable: false },
  ];

  async function deleteSeparatePositionHandler(separate_position: RecruitmentSeparatePositionDto) {
    if (separate_position.id && recruitmentId) {
      const msg = lowerCapitalize(`${t(KEY.form_confirm)} ${t(KEY.common_delete)}`);
      if (window.confirm(`${msg} ${dbT(separate_position, 'name')}`)) {
        deleteRecruitmentSeparatePosition(separate_position.id.toString()).then(() =>
          getRecruitment(recruitmentId).then((response) => {
            setRecruitment(response.data);
          }),
        );
      }
    }
  }

  const tableSeparatePositionData = recruitment?.separate_positions?.map((separate_position) => {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_separateposition_edit,
      urlParams: { recruitmentId: recruitmentId, separatePositionId: separate_position.id },
    });

    return [
      { content: <Link url={pageUrl}>{dbT(separate_position, 'name')}</Link> },
      { content: <Link url={separate_position.url}>{separate_position.url}</Link> },
      {
        content: (
          <CrudButtons
            onDelete={() => {
              deleteSeparatePositionHandler(separate_position);
            }}
            onEdit={() => {
              navigate({ url: pageUrl });
            }}
          />
        ),
      },
    ];
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
      <Button
        theme="samf"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_room_overview,
          urlParams: { recruitmentId },
        })}
      >
        {t(KEY.recruitment_create_room)}
      </Button>
      <Button
        theme="success"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_gang_separateposition_create,
          urlParams: { recruitmentId },
        })}
      >
        {t(KEY.common_create)} {t(KEY.recruitment_gangs_with_separate_positions)}
      </Button>
      {recruitmentId && <OccupiedFormModal recruitmentId={Number.parseInt(recruitmentId)} isButtonRounded={true} />}
    </>
  );

  // TODO: Fix rerender
  const tabs: Tab<ReactElement>[] = [
    { key: 1, label: t(KEY.common_gangs), value: <Table columns={tableGangColumns} data={tableGangData} /> },
    {
      key: 2,
      label: t(KEY.recruitment_gangs_with_separate_positions),
      value: <Table columns={tableSeparatePositionColumns} data={tableSeparatePositionData ?? []} />,
    },
  ];

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={loading}>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
