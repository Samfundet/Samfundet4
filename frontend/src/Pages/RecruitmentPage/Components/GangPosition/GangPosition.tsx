import { ExpandableHeader, Link } from '~/Components';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
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
                <Link
                  url={reverse({
                    pattern: ROUTES.frontend.recruitment_application,
                    urlParams: { positionID: pos.id, gangID: gang.id },
                  })}
                  className={styles.position_name}
                >
                  {dbT(pos, 'name')}
                </Link>
                <Link
                  url={reverse({
                    pattern: ROUTES.frontend.recruitment_application,
                    urlParams: { positionID: pos.id, gangID: gang.id },
                  })}
                  className={styles.position_short_desc}
                >
                  {dbT(pos, 'short_description')}
                </Link>
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
