import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { GangTypeContainer } from './Components';
import styles from './RecruitmentPage.module.scss';

export function RecruitmentPage() {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();
  const { t } = useTranslation();

  const noadmissions = (
    <div className={styles.no_recruitment_wrapper}>
      <div>
        <h1 className={styles.header}>{t(KEY.no_recruitment_text)}</h1>
      </div>

      <div className={styles.info}>
        <p>
          <br />
          {t(KEY.no_recruitment_text_0)}
          <br />
          {t(KEY.no_recruitment_text_1)}
          <br />
          {t(KEY.no_recruitment_text_2)}
          <br />
          <br />
          {t(KEY.no_recruitment_text_3)}
          <br />
          {t(KEY.no_recruitment_text_4)}{' '}
          <strong>
            <a className={styles.link} href={ROUTES.frontend.contact}>
              {t(KEY.common_click_here)}
            </a>
          </strong>
          <br />
          {t(KEY.no_recruitment_text_5)}
        </p>
      </div>
    </div>
  );

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
        {loading ? (
          <SamfundetLogoSpinner />
        ) : recruitmentPositions ? (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        ) : (
          noadmissions
        )}
      </div>
    </Page>
  );
}
