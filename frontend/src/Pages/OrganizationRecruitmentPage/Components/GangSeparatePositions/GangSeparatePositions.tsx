import { useTranslation } from 'react-i18next';
import { ExpandableHeader, Link, Text } from '~/Components';
import type { RecruitmentSeparatePositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './GangSeparatePositions.module.scss';

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
            <Text as="strong">{dbT(pos, 'name')}</Text>
            <Text>{dbT(pos, 'description')}</Text>
          </Link>
        </div>
      ))}
    </ExpandableHeader>
  );
}
