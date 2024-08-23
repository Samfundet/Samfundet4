import { ExpandableHeader, Link } from '~/Components';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './GangPositionDropdown.module.scss';

type GangItemProps = {
  type: GangTypeDto;
  recruitmentPositions?: RecruitmentPositionDto[];
};

//TODO: DO IN ISSUE #1121, only get gang types recruiting from backend
// TODO: so the filtering should be done from the backend
export function GangPositionDropdown({ type, recruitmentPositions }: GangItemProps) {
  const filteredGangs = type.gangs
    .map((gang) => {
      const filteredPositions = recruitmentPositions?.filter((pos) => pos.gang.id === gang.id);
      if (filteredPositions && filteredPositions.length > 0) {
        return (
          <ExpandableHeader
            showByDefault={true}
            key={gang.id}
            label={dbT(gang, 'name') ?? 'N/A'}
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
                  {dbT(pos, 'name') ?? 'N/A'}
                </Link>
                <Link
                  url={reverse({
                    pattern: ROUTES.frontend.recruitment_application,
                    urlParams: { positionID: pos.id, gangID: gang.id },
                  })}
                  className={styles.position_short_desc}
                >
                  {dbT(pos, 'short_description') ?? 'N/A'}
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
      <ExpandableHeader
        showByDefault={true}
        key={type.id}
        label={dbT(type, 'title') ?? 'N/A'}
        className={styles.type_header}
      >
        {filteredGangs}
      </ExpandableHeader>
    );
  }
  return null;
}
