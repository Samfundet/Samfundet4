import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { Button, CrudButtons, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentPositionsGangForGang } from '~/api';
import type { GangDto, RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { RecruitmentGangLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentGangAdminPage.module.scss';

export function RecruitmentGangAdminPage() {
  const { recruitmentId, gangId } = useParams();
  const navigate = useNavigate();
  const [gang, setGang] = useState<GangDto>();
  const loader = useLoaderData() as RecruitmentGangLoader | undefined;
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const { t } = useTranslation();
  const title = `${getObjectFieldOrNumber<string>(recruitment?.organization, 'name')} - ${dbT(
    recruitment,
    'name',
  )} - ${dbT(gang, 'name')}`;
  useTitle(title);

  // TODO add way to handle 404s
  const { data: recruitmentPositions, isLoading } = useQuery({
    queryKey: ['recruitmentGangAdmin', recruitmentId, gangId],
    queryFn: () => (recruitmentId && gangId ? getRecruitmentPositionsGangForGang(recruitmentId, gangId) : undefined),
    enabled: !!recruitmentId && !!gangId,
  });

  useEffect(() => {
    if (loader) {
      setGang(loader.gang);
      setRecruitment(loader.recruitment);
    }
  }, [loader]);

  const tableColumns = [
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_jobtype), sortable: true },
    { content: t(KEY.recruitment_applicants), sortable: true },
    { content: t(KEY.recruitment_processed), sortable: true },
    { content: t(KEY.recruitment_accepted_applicants), sortable: true },
    { content: ' ', sortable: false },
  ];

  const data = recruitmentPositions?.data.map((recruitmentPosition) => {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gangId, positionId: recruitmentPosition.id },
    });
    return {
      cells: [
        {
          content: <Link url={pageUrl}>{dbT(recruitmentPosition, 'name')}</Link>,
          value: dbT(recruitmentPosition, 'name'),
        },
        {
          value: recruitmentPosition.is_funksjonaer_position,
          content: recruitmentPosition.is_funksjonaer_position
            ? t(KEY.recruitment_funksjonaer)
            : t(KEY.recruitment_gangmember),
        },
        { value: recruitmentPosition.total_applicants, content: recruitmentPosition.total_applicants },
        {
          value: recruitmentPosition.processed_applicants,
          content:
            recruitmentPosition.total_applicants === recruitmentPosition.processed_applicants
              ? t(KEY.common_all)
              : recruitmentPosition.processed_applicants,
        },
        { value: recruitmentPosition.accepted_applicants, content: recruitmentPosition.accepted_applicants },
        {
          content: (
            <CrudButtons
              onView={() => {
                navigate(
                  reverse({
                    pattern: ROUTES.frontend.recruitment_application,
                    urlParams: {
                      positionId: recruitmentPosition.id,
                      recruitmentId: recruitmentId,
                    },
                  }),
                );
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
      ],
    };
  });

  const backendUrl = ROUTES.backend.admin__samfundet_informationpage_changelist;
  const header = (
    <div className={styles.headerRow}>
      <Button
        theme="success"
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
        theme="yellow"
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_gang_users_without_interview,
          urlParams: {
            gangId: gangId,
            recruitmentId: recruitmentId,
          },
        })}
      >
        {t(KEY.recruitment_show_applicants_without_interview)}
      </Button>
      <Button
        theme="outlined"
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_gang_all_applications,
          urlParams: {
            gangId: gangId,
            recruitmentId: recruitmentId,
          },
        })}
      >
        {lowerCapitalize(t(KEY.recruitment_show_all_applicants))}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
