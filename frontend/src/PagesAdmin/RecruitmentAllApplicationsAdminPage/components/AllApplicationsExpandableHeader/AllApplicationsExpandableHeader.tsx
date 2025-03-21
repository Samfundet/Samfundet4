import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ExpandableHeader } from '~/Components';
import type { RecruitmentApplicantApplicationsDto, RecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './AllApplicationsExpandableHeader.module.scss';

type AllApplicationsExpandableHeaderProps = {
  user: RecruitmentApplicantApplicationsDto;
  recruitment: RecruitmentDto;
  onSetInterviewClick?: () => void;
  table: ReactNode;
};

export function AllApplicationsExpandableHeader({
  user,
  recruitment,
  onSetInterviewClick,
  table,
}: AllApplicationsExpandableHeaderProps) {
  const { t } = useTranslation();

  const setInterviewsButton = (
    <div className={styles.set_interview_button}>
      <div className={styles.header_label_item}>
        <Button theme="blue" onClick={onSetInterviewClick}>
          {t(KEY.recruitment_interview_set)}
        </Button>
      </div>
    </div>
  );

  const headerLabel = (
    <div className={styles.header_label}>
      <div className={styles.applicant_contact_container}>
        <div className={styles.header_label_item}>
          {user.first_name} {user.last_name}
        </div>
        <div className={styles.header_label_item}>{user.email}</div>
        <div className={styles.header_label_item}>{user.phone_number || 'N/A'}</div>
      </div>
      {
        //TODO: implement actuall permissions / state-control for this
        recruitment?.organization.name !== 'Samfundet' && setInterviewsButton
      }
    </div>
  );

  return (
    <ExpandableHeader
      key={user.id}
      showByDefault={true}
      label={headerLabel}
      className={styles.expandable_header}
      theme="child"
    >
      {table}
    </ExpandableHeader>
  );
}
