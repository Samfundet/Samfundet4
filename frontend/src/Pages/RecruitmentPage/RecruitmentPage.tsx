import { useEffect, useState } from 'react';
import { ExpandableHeader, Page, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './RecruitmentPage.module.scss';

export function RecruitmentPage() {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();

  useEffect(() => {
    Promise.all([getActiveRecruitmentPositions(), getGangList()])
      .then(([recruitmentRes, gangsRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setGangs(gangsRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const renderGangTypes = () => {
    if (!gangTypes) return null;

    return gangTypes
      .map((type) => {
        const filteredGangs = type.gangs
          .map((gang) => {
            const filteredPositions = recruitmentPositions?.filter((pos) => pos.gang == `${gang.id}`);
            if (filteredPositions && filteredPositions.length > 0) {
              return (
                <ExpandableHeader key={gang.id} label={dbT(gang, 'name')} className={styles.gang_header}>
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
            <ExpandableHeader key={type.id} label={dbT(type, 'title')} className={styles.type_header}>
              {filteredGangs}
            </ExpandableHeader>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <Page>
      <div className={styles.container}>
        <Video embedId="-nYQb8_TvQ4" className={styles.video}></Video>
        {loading ? <div>Loading...</div> : renderGangTypes()}
      </div>
    </Page>
  );
}
