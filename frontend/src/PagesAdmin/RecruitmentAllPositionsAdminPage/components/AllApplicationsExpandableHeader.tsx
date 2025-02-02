import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ExpandableHeader } from '~/Components';
import type { RecruitmentDto, UserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './AllApplicationsExpandableHeader.module.scss';

type AllApplicationsExpandableHeaderProps = {
  user: UserDto;
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

  const headerLabel = (
    <div className={styles.header_label}>
      <div>
        {user.first_name} {user.last_name}
      </div>
      <div>{user.email}</div>
      <div>{user.phone_number || 'N/A'}</div>
      {recruitment?.organization.name !== 'Samfundet' && (
        <Button theme="blue" onClick={onSetInterviewClick}>
          {t(KEY.recruitment_interview_set)}
        </Button>
      )}
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
