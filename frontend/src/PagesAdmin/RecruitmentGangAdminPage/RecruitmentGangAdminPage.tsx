import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CrudButtons, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getGang, getRecruitment, getRecruitmentPositionsGang } from '~/api';
import type { GangDto, RecruitmentDto, RecruitmentPositionDto } from '~/dto';
import styles from './RecruitmentGangAdminPage.module.scss';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentGangAdminPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const navigate = useNavigate();
  const [gang, setGang] = useState<GangDto>();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (recruitmentId && gangId) {
      Promise.allSettled([
        getRecruitmentPositionsGang(recruitmentId, gangId).then((data) => {
          setRecruitmentPositions(data.data);
        }),
        getGang(gangId).then((data) => {
          setGang(data);
        }),
        getRecruitment(recruitmentId).then((data) => {
          setRecruitment(data.data);
        }),
      ]).then(() => {
        setShowSpinner(false);
      });
    }
  }, [recruitmentId, gangId]);

  const tableColumns = [
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_jobtype), sortable: true },
    { content: t(KEY.recruitment_applicants), sortable: true },
    { content: t(KEY.recruitment_processed), sortable: true },
    { content: t(KEY.recruitment_accepted_applicants), sortable: true },
    { content: ' ', sortable: false },
  ];

  const data = recruitmentPositions.map((recruitmentPosition) => {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
      urlParams: { recruitmentId: recruitmentId, gangId: gangId, positionId: recruitmentPosition.id },
    });
    return [
      {
        content: <Link url={pageUrl}>{dbT(recruitmentPosition, 'name')}</Link>,
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
                    positionID: recruitmentPosition.id,
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
    ];
  });

  const title = `${dbT(gang, 'name')} - ${recruitment?.organization} - ${dbT(recruitment, 'name')}`;
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
      <Button theme="secondary" onClick={() => alert('TODO Add view of all applicants for gang')}>
        {lowerCapitalize(t(KEY.recruitment_show_all_applicants))}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner} showBackButton={true}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
