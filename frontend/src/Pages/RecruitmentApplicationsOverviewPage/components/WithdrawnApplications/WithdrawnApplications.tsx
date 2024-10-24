import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Table } from '~/Components';
import { getWithdrawRecruitmentApplicationApplicant } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './WithdrawnApplications.module.scss';

type WithdrawnApplicationsProps = {
  recruitmentId?: string;
};
export function WithdrawnApplications({ recruitmentId }: WithdrawnApplicationsProps) {
  const [withdrawnApplications, setWithdrawnApplications] = useState<RecruitmentApplicationDto[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (recruitmentId) {
      getWithdrawRecruitmentApplicationApplicant(recruitmentId).then((response) => {
        setWithdrawnApplications(response.data);
      });
    }
  }, [recruitmentId]);

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
                positionID: application.recruitment_position.id,
                gangID: application.recruitment_position.gang.id,
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
            data={withdrawnApplications.map((application) => ({
              cells: withdrawnApplicationToTableRow(application),
            }))}
            columns={withdrawnTableColumns}
          />
        </div>
      )}
    </div>
  );
}
