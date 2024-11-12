import { useTranslation } from 'react-i18next';
import { Button, ExpandableHeader, Table } from '~/Components';
import type { RecruitmentSharedInterviewPositionsDto, RecruitmentStatsDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentSharedInterviewPositionsComponent.module.scss';

type RecruitmentSharedInterviewPositionsComponentProps = {
  interviewGroup: RecruitmentSharedInterviewPositionsDto;
};

export function RecruitmentSharedInterviewPositionsComponent({
  interviewGroup,
}: RecruitmentSharedInterviewPositionsComponentProps) {
  const interviewGroupHeader = dbT(interviewGroup, 'name') ?? 'N/A';
  const { t } = useTranslation();

  return (
    <ExpandableHeader
      showByDefault={true}
      key={interviewGroup.id}
      label={interviewGroupHeader}
      className={styles.dropDownHeader}
    >
      <Table
        className={styles.table}
        data={interviewGroup.positions.map((position) => {
          return { cells: [dbT(position, 'name'), dbT(position.gang, 'name')] };
        })}
      />
      <div className={styles.footer}>
        <Button
          display="basic"
          theme="blue"
          rounded={true}
          link={reverse({
            pattern: ROUTES.frontend.admin_recruitment_sharedinterviewgroup_edit,
            urlParams: { recruitmentId: interviewGroup.recruitment, sharedInterviewGroupId: interviewGroup.id },
          })}
        >
          {t(KEY.common_edit)}
        </Button>
      </div>
    </ExpandableHeader>
  );
}
