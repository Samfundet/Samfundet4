import { ExpandableHeader } from '~/Components';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './GangPosition.module.scss';

type GangItemProps = {
  type: GangTypeDto;
  recruitmentPositions?: RecruitmentPositionDto[];
};

export function GangPosition({ type, recruitmentPositions }: GangItemProps) {
  const filteredGangs = type.gangs
    .map((gang) => {
      const filteredPositions = recruitmentPositions?.filter((pos) => pos.gang == `${gang.id}`);
      if (filteredPositions && filteredPositions.length > 0) {
        return (
          <ExpandableHeader
            showByDefault={true}
            key={gang.id}
            label={dbT(gang, 'name')}
            className={styles.gang_header}
            theme="child"
          >
            {filteredPositions.map((pos) => (
              <div className={styles.position_item} key={pos.id}>
                <a className={styles.position_name}>{dbT(pos, 'name')}</a>
                <a className={styles.position_short_desc}>{dbT(pos, 'short_description')}</a>
              </div>
            ))}
          </ExpandableHeader>
        );
      }
      return null;
    })
    .filter(Boolean);

  if (filteredGangs.length > 0) {
    return (
      <ExpandableHeader showByDefault={true} key={type.id} label={dbT(type, 'title')} className={styles.type_header}>
        {filteredGangs}
      </ExpandableHeader>
    );
  }
  return null;
}
