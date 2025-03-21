import { Icon } from '@iconify/react';
import { Link } from '~/Components';
import type { RecruitmentApplicationDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { COLORS } from '~/types';
import { dbT } from '~/utils';
import type { PriorityChange } from '../ControlPriorityButton';
import styles from './ActiveApplicationLink.module.scss';

type ActiveApplicationLinkProps = {
  application: RecruitmentApplicationDto;
  recentChanges: PriorityChange[];
};

export function ActiveApplicationLink({ application, recentChanges }: ActiveApplicationLinkProps) {
  const change = recentChanges.find((change) => change.id === application.id);

  return (
    <div className={styles.positionLinkWrapper}>
      {change &&
        (change.direction === 'up' ? (
          <Icon
            className={styles.priorityChangeIndicator}
            icon={'material-symbols:arrow-drop-up-rounded'}
            color={COLORS.green_light}
          />
        ) : (
          <Icon
            className={styles.priorityChangeIndicator}
            icon={'material-symbols:arrow-drop-down-rounded'}
            color={COLORS.red_light}
          />
        ))}
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
