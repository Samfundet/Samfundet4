import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InterviewFormModal, Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList, getRecruitmentAdmissionsForApplicant, getRecruitmentAdmissionsForGang } from '~/api';
import { TextItem } from '~/constants';
import { GangTypeDto, RecruitmentAdmissionDto, RecruitmentPositionDto } from '~/dto';
import { useTextItem, useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { GangTypeContainer } from './Components';
import styles from './RecruitmentPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { reverse } from '~/named-urls';

export function RecruitmentPage() {
  const navigate = useCustomNavigate();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();
  const { t } = useTranslation();

  const [testAdmission, setTestAdmission] = useState<RecruitmentAdmissionDto>();
  const noadmissions = (
    <div className={styles.no_recruitment_wrapper}>
      <div>
        <h1 className={styles.header}>{useTextItem(TextItem.no_recruitment_text)}</h1>
      </div>

      <div className={styles.info}>
        <p>
          <br />
          {useTextItem(TextItem.no_recruitment_text_0)}
          <br />
          {useTextItem(TextItem.no_recruitment_text_1)}
          <br />
          {useTextItem(TextItem.no_recruitment_text_2)}
          <br />
          <br />
          {useTextItem(TextItem.no_recruitment_text_3)}
          <br />
          {useTextItem(TextItem.no_recruitment_text_4)}{' '}
          <strong>
            <a className={styles.link} href={ROUTES.frontend.contact}>
              {t(KEY.common_click_here)}
            </a>
          </strong>
          <br />
          {useTextItem(TextItem.no_recruitment_text_5)}
        </p>
      </div>
    </div>
  );

  useEffect(() => {
    Promise.all([getActiveRecruitmentPositions(), getGangList(), getRecruitmentAdmissionsForGang('1', '1')])
      .then(([recruitmentRes, gangsRes, admissionRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setGangs(gangsRes);
        setTestAdmission(admissionRes.data[0]);
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
          {testAdmission && <InterviewFormModal admission={testAdmission} /> }
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
        ) : recruitmentPositions ? (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        ) : (
          noadmissions
        )}
      </div>
    </Page>
  );
}
