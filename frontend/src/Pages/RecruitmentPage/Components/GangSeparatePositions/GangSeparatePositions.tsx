import { ExpandableHeader, Link } from '~/Components';
import { RecruitmentSeparatePositionDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './GangSeparatePositions.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';

type GangSeparatePositionsProps = {
  recruitmentSeparatePositions: RecruitmentSeparatePositionDto[];
};

export function GangSeparatePositions({ recruitmentSeparatePositions }: GangSeparatePositionsProps) {
  const { t } = useTranslation();
  return (
    <ExpandableHeader
      showByDefault={true}
      label={t(KEY.recruitment_gangs_with_separate_positions)}
      className={styles.separate_header}
    >
      {recruitmentSeparatePositions.map((pos) => (
        <div className={styles.separate_item} key={pos.name_en}>
          <Link target="external" url={pos.url} className={styles.separate_name}>
            {dbT(pos, 'name')}
          </Link>
        </div>
      ))}
    </ExpandableHeader>
  );
}
