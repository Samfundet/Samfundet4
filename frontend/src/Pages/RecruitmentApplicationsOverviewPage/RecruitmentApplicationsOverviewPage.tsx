/* eslint-disable prettier/prettier */
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link, Page } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentAdmissionsForApplicant, putRecruitmentPriorityForUser } from '~/api';
import { RecruitmentAdmissionDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT, niceDateTime } from '~/utils';
import styles from './RecruitmentApplicationsOverviewPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { reverse } from '~/named-urls';
import { Text } from '~/Components/Text/Text';

export function RecruitmentApplicationsOverviewPage() {
  const { recruitmentID } = useParams();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);
  const [withdrawnAdmissions, setWithdrawnAdmissions] = useState<RecruitmentAdmissionDto[]>([]);

  const { t } = useTranslation();

  function handleChangePriority(id: string, direction: 'up' | 'down') {
    const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
    putRecruitmentPriorityForUser(id, data).then((response) => {
      setAdmissions(response.data);
    });
  }

  function upDownArrow(id: string) {
    return (
      <>
        <Icon icon="bxs:up-arrow" className={styles.arrows} onClick={() => handleChangePriority(id, 'up')} />
        <Icon icon="bxs:down-arrow" className={styles.arrows} onClick={() => handleChangePriority(id, 'down')} />
      </>
    );
  }

  useEffect(() => {
    if (recruitmentID) {
      getRecruitmentAdmissionsForApplicant(recruitmentID).then((response) => {
        setAdmissions(response.data.filter((admission) => !admission.withdrawn));
        setWithdrawnAdmissions(response.data.filter((admission) => admission.withdrawn));
      });
    }
  }, [recruitmentID]);

  const tableColumns = [
    { sortable: false, content: t(KEY.recruitment_position) },
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },
    { sortable: true, content: t(KEY.recruitment_priority) },
    { sortable: false, content: '' },
  ];

  function admissionToTableRow(admission: RecruitmentAdmissionDto) {
    const position = [ {
      content: (
        <Link
          url={reverse({
            pattern: ROUTES.frontend.recruitment_application,
            urlParams: {
              positionID: admission.recruitment_position.id,
              gangID: admission.recruitment_position.gang.id,
            },
          })}
          className={styles.position_name}
        >
          {dbT(admission.recruitment_position, 'name')}
        </Link>
      ),
    }];
    const notWithdrawn = [      
      niceDateTime(admission.interview?.interview_time),
      admission.interview?.interview_location,
      admission.applicant_priority,
      { content: upDownArrow(admission.id) },
    ];
    const withdrawn = [ {
      content: (
        <Text
          as="strong"
          className={styles.withdrawnText}
        >
          {t(KEY.recruitment_withdrawn)}
        </Text>
      ),
    }];
    return [...position, ...(admission.withdrawn ? withdrawn : notWithdrawn)];
  }

  const withdrawnTableColumns = [{ sortable: true, content: t(KEY.recruitment_withdrawn_admissions) }];

  function withdrawnAdmissionToTableRow(admission: RecruitmentAdmissionDto) {
    return [
      {
        value: dbT(admission.recruitment_position, 'name'),
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.recruitment_application,
              urlParams: {
                positionID: admission.recruitment_position.id,
                gangID: admission.recruitment_position.gang.id,
              },
            })}
            className={styles.withdrawnLink}
          >
            {dbT(admission.recruitment_position, 'name')}
          </Link>
        ),
      },
    ];
  }

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.top_container}>
          <Button link={ROUTES.frontend.recruitment} className={styles.back_button} theme="green">
            {t(KEY.common_go_back)}
          </Button>
          <h1 className={styles.header}>{t(KEY.recruitment_my_applications)}</h1>
          <div className={styles.empty_div}></div>
        </div>
        <p>{t(KEY.recruitment_will_be_anonymized)}</p>
        {admissions.length > 0 ? (
          <Table data={admissions.map(admissionToTableRow)} columns={tableColumns} defaultSortColumn={3}></Table>
        ) : (
          <p>{t(KEY.recruitment_not_applied)}</p>
        )}

        <OccupiedFormModal recruitmentId={parseInt(recruitmentID ?? '')} />

        {withdrawnAdmissions.length > 0 && (
          <div className={styles.withdrawnContainer}>
            <Table
              bodyRowClassName={styles.withdrawnRow}
              headerClassName={styles.withdrawnHeader}
              headerColumnClassName={styles.withdrawnHeader}
              data={withdrawnAdmissions.map(withdrawnAdmissionToTableRow)}
              columns={withdrawnTableColumns}
            />
          </div>
        )}
      </div>
    </Page>
  );
}
