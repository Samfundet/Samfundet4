import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { TextItem } from '~/constants';
import { GangTypeDto, RecruitmentDto, RecruitmentPositionDto } from '~/dto';
import { useTextItem, useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { GangTypeContainer, RecruitmentCard } from './Components';
import styles from './RecruitmentPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { reverse } from '~/named-urls';
import { useAuthContext } from '~/AuthContext';

export function RecruitmentPage() {
  const navigate = useCustomNavigate();
  const { user } = useAuthContext();
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [recruitments, setRecruitments] = useState<Partial<RecruitmentDto>[]>([]);

  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();
  const { t } = useTranslation();

  /**
   * TODO: issue #1114, update recruitment data.
   * */
  useEffect(() => {
    const mock_data: object[] = [
      {
        id: '1',
        name_nb: 'Opptak',
        name_en: 'Recruitment_name_placeholder',
        shown_application_deadline: '25. august, 2069',
        reprioritization_deadline_for_applicant: '4. september, 2069',
        organization: 'samfundet',
      },
      {
        id: '2',
        name_nb: 'Opptak_navn_2_placeholder',
        name_en: 'Recruitment_name_2_placeholder',
        shown_application_deadline: '15. januar, 2069',
        reprioritization_deadline_for_applicant: '4. september, 2069',
        organization: 'uka',
      },
      {
        id: '3',
        name_nb: 'Mangler ompr. frist med vilje',
        name_en: 'Recruitment_name_3_placeholder',
        shown_application_deadline: '15. januar, 2069',
        organization: 'isfit',
      },
    ];
    setRecruitments(mock_data);
  }, []);

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
        <div className={styles.cardContainer}>
          {recruitments.map((recruitment: Partial<RecruitmentDto>) => (
            <RecruitmentCard
              key={recruitment.id}
              recruitment_id={recruitment.id}
              recruitment_name_nb={recruitment.name_nb}
              recruitment_name_en={recruitment.name_en}
              shown_application_deadline={recruitment.shown_application_deadline}
              reprioritization_deadline_for_applicant={recruitment.reprioritization_deadline_for_applicant}
              recruitment_organization={recruitment.organization}
              isAuthenticated={!!user}
            />
          ))}
        </div>
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
        ) : recruitmentPositions ? (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        ) : (
          noadmissions
        )}
      </div>
    </Page>
  );
}
