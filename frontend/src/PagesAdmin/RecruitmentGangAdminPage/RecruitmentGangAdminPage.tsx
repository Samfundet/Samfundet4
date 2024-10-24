import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, CrudButtons, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getGang, getRecruitment, getRecruitmentPositionsGangForGang } from '~/api';
import type { GangDto, RecruitmentDto, RecruitmentPositionDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentGangAdminPage.module.scss';

export function RecruitmentGangAdminPage() {
  const { recruitmentId, gangId } = useParams();
  const navigate = useNavigate();
  const [gang, setGang] = useState<GangDto>();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const title = `${getObjectFieldOrNumber<string>(recruitment?.organization, 'name')} - ${dbT(
    recruitment,
    'name',
  )} - ${dbT(gang, 'name')}`;
  useTitle(title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (recruitmentId && gangId) {
      Promise.allSettled([
        getRecruitmentPositionsGangForGang(recruitmentId, gangId).then((data) => {
          setRecruitmentPositions(data.data);
        }),
        getGang(gangId).then((data) => {
          setGang(data);
        }),
        getRecruitment(recruitmentId).then(async (data) => {
          setRecruitment(data.data);
        }),
      ])
        .then(() => {
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.not_found, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
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
    return {
      cells: [
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
                      positionId: recruitmentPosition.id,
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
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}
