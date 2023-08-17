import { useEffect, useState } from 'react';
import { ExpandableHeader, Page, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './RecruitmentPage.module.scss';

/** Page used by cypress to check healthy rendering of frontend. */
export function RecruitmentPage() {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();

  useEffect(() => {
    // Using Promise.all() to wait for both promises to complete
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

    return gangTypes.map((type) => (
      <ExpandableHeader key={type.id} label={dbT(type, 'title')}>
        {type.gangs.map((gang) => (
          <ExpandableHeader key={gang.id} label={dbT(gang, 'name')}>
            {recruitmentPositions
              ?.filter((pos) => pos.gang == `${gang.id}`)
              .map((pos) => (
                <div key={pos.id} className={styles.recruitment_position}>
                  <p className={styles.recruitment_position_title}>{dbT(pos, 'name')}</p>
                  <p className={styles.recruitment_position_description}>{dbT(pos, 'short_description')}</p>
                </div>
              ))}
          </ExpandableHeader>
        ))}
      </ExpandableHeader>
    ));
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
