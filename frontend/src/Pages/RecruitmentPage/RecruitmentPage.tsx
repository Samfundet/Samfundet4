import { useEffect, useState } from 'react';
import { Button, Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangTypeContainer } from './Components';
import styles from './RecruitmentPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { reverse } from '~/named-urls';
import { useCustomNavigate } from '~/hooks';
import { ROUTES } from '~/routes';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

export function RecruitmentPage() {
  const { t } = useTranslation();

  const navigate = useCustomNavigate();
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
        <div className={styles.personalRow}>
          <OccupiedFormModal recruitmentId={1} />
          <Button
            theme="samf"
            onClick={() => {
              navigate({
                url: reverse({
                  pattern: ROUTES.frontend.recruitment_application_overview,
                  urlParams: { recruitmentID: 1 },
                }),
              });
            }}
          >
            {t(KEY.recruitment_organization)}
          </Button>
        </div>
        {loading ? (
          <SamfundetLogoSpinner />
        ) : (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        )}
      </div>
    </Page>
  );
}
