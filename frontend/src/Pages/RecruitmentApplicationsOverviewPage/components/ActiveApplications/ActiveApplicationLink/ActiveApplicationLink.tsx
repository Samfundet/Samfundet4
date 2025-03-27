import { Link } from '~/Components';
import type { RecruitmentApplicationDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import type { PriorityChangeType } from '../ActiveApplications';
import styles from './ActiveApplicationLink.module.scss';
import { PriorityChangeIndicator } from './PriorityChangeIndicator/PriorityChangeIndicator';

type ActiveApplicationLinkProps = {
  application: RecruitmentApplicationDto;
  recentChanges: PriorityChangeType[];
};

export function ActiveApplicationLink({ application, recentChanges }: ActiveApplicationLinkProps) {
  // Find a successful change for this application
  const change = recentChanges.find((change) => change.id === application.id && change.successful);

  return (
    <div className={styles.positionLinkWrapper}>
      {change && <PriorityChangeIndicator direction={change.direction} />}
      <Link
        url={reverse({
          pattern: ROUTES.frontend.recruitment_application,
          urlParams: {
            recruitmentId: application.recruitment,
            positionId: application.recruitment_position.id,
          },
        })}
        className={styles.positionName}
      >
        {dbT(application.recruitment_position, 'name')}
      </Link>
    </div>
  );
}
