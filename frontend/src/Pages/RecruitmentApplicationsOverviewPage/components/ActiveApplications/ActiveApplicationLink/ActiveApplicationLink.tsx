import { Link } from '~/Components';
import type { RecruitmentApplicationDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './ActiveApplicationLink.module.scss';
import { PriorityChangeIndicator } from './PriorityChangeIndicator/PriorityChangeIndicator';

type ActiveApplicationLinkProps = {
  application: RecruitmentApplicationDto;
  changedApplicationIds: Record<string, 'up' | 'down'>;
};

export function ActiveApplicationLink({ application, changedApplicationIds }: ActiveApplicationLinkProps) {
  // Find a successful change for this application
  const direction = changedApplicationIds[application.id];

  return (
    <div className={styles.positionLinkWrapper}>
      {direction && <PriorityChangeIndicator direction={direction} />}
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
