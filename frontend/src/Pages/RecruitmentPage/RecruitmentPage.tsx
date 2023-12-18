import { useEffect, useState } from 'react';
import { Button, IconButton, Modal, Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangTypeContainer } from './Components';
import styles from './RecruitmentPage.module.scss';
import { OccupiedForm } from '~/Components/OccupiedForm';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

export function RecruitmentPage() {
  const { t } = useTranslation();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();

  const [occupiedModal, setOccupiedModal] = useState(false);
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
        <Button theme="samf" onClick={() => setOccupiedModal(true)}>
          {t(KEY.occupied_show)}
        </Button>
        <Modal isOpen={occupiedModal}>
          <div>
            <IconButton
              title="close"
              className={styles.close}
              icon="mdi:close"
              onClick={() => setOccupiedModal(false)}
            ></IconButton>
            <OccupiedForm recruitmentId={1}></OccupiedForm>
          </div>
        </Modal>

        {loading ? (
          <SamfundetLogoSpinner />
        ) : (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        )}
      </div>
    </Page>
  );
}
