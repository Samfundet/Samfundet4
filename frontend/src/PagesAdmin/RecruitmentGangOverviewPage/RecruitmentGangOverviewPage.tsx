import { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CrudButtons, Link, type Tab, TabView } from '~/Components';
import { Table } from '~/Components/Table';
import { deleteRecruitmentSeparatePosition, getRecruitment, getRecruitmentGangs } from '~/api';
import type { RecruitmentDto, RecruitmentGangDto, RecruitmentSeparatePositionDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { AppletContainer } from './components';

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

    return {
      cells: [{ content: <Link url={pageUrl}>{dbT(gang, 'name')}</Link> }, gang.recruitment_positions],
    };
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

    return {
      cells: [
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
      ],
    };
  });

  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <>
      <AppletContainer recruitmentId={recruitmentId} />
    </>
  );

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
