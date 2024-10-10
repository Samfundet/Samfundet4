import { ExpandableHeader, Table } from '~/Components';
import type { RecruitmentSharedInterviewGroupDto, RecruitmentStatsDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './RecruitmentInterviewGroupComponent.module.scss';

type RecruitmentInterviewGroupComponentProps = {
  interviewGroup: RecruitmentSharedInterviewGroupDto;
};

export function RecruitmentInterviewGroupComponent({ interviewGroup }: RecruitmentInterviewGroupComponentProps) {
  return (
    <ExpandableHeader
      showByDefault={true}
      key={interviewGroup.id}
      label={dbT(interviewGroup, 'name') ?? 'N/A'}
      className={styles.dropDownHeader}
    >
      <Table
        className={styles.table}
        data={interviewGroup.positions.map((position) => [dbT(position, 'name'), dbT(position.gang, 'name')])}
      />
    </ExpandableHeader>
  );
}
