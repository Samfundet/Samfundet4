import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, Table } from '~/Components';
import { getWithdrawnRecruitmentApplicationsApplicant } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import type { ApplicantApplicationManagementQK } from '../../RecruitmentApplicationsOverviewPage';
import styles from './WithdrawnApplications.module.scss';

type WithdrawnApplicationsProps = {
  recruitmentId: string;
  queryKey: ApplicantApplicationManagementQK;
};
export function WithdrawnApplications({ recruitmentId, queryKey }: WithdrawnApplicationsProps) {
  const { t } = useTranslation();

  const { data: withdrawnApplications = [] } = useQuery({
    queryKey: queryKey.withdrawnApplications(recruitmentId),
    queryFn: () => getWithdrawnRecruitmentApplicationsApplicant(recruitmentId).then((response) => response.data),
    enabled: !!recruitmentId,
  });

  const withdrawnTableColumns = [{ sortable: true, content: t(KEY.recruitment_withdrawn) }];

  function withdrawnApplicationToTableRow(application: RecruitmentApplicationDto) {
    return [
      {
        value: dbT(application.recruitment_position, 'name'),
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.recruitment_application,
              urlParams: {
                recruitmentId: application.recruitment,
                positionId: application.recruitment_position.id,
              },
            })}
            className={styles.withdrawnLink}
          >
            {dbT(application.recruitment_position, 'name')}
          </Link>
        ),
      },
    ];
  }

  return (
    <div>
      {withdrawnApplications.length > 0 && (
        <div className={styles.withdrawnContainer}>
          <Table
            bodyRowClassName={styles.withdrawnRow}
            headerClassName={styles.withdrawnHeader}
            headerColumnClassName={styles.withdrawnHeader}
            data={withdrawnApplications.map((application: RecruitmentApplicationDto) => ({
              cells: withdrawnApplicationToTableRow(application),
            }))}
            columns={withdrawnTableColumns}
          />
        </div>
      )}
    </div>
  );
}
