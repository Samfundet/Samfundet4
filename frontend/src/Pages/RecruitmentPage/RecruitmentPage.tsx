import { useEffect, useState } from 'react';
import { Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangTypeContainer } from './Components';
import styles from './RecruitmentPage.module.scss';
import { OccupiedForm } from '~/Components/OccupiedForm';

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

  return (
    <Page>
      <div className={styles.container}>
        <Video embedId="-nYQb8_TvQ4" className={styles.video}></Video>
        <OccupiedForm recruitmentId='1'></OccupiedForm>
        {loading ? (
          <SamfundetLogoSpinner />
        ) : (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        )}
      </div>
    </Page>
  );
}
