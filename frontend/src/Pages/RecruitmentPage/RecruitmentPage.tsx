import { useEffect, useState } from 'react';
import { Page, SamfundetLogoSpinner, Text } from '~/Components';
import { getActiveRecruitments } from '~/api';
import { RecruitmentDto } from '~/dto';
import { RecruitmentCard } from './Components';
import styles from './RecruitmentPage.module.scss';
import { useAuthContext } from '~/AuthContext';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';

export function RecruitmentPage() {
  const { user } = useAuthContext();
  const [recruitments, setRecruitments] = useState<RecruitmentDto[]>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // TODO: issue #1114, update recruitment data.
  // TODO: --> this includes creating a /recruitment/:organizationID/:recruitmentID/
  // TODO: and the model/view/serializer/url features which is needed to support this

  useEffect(() => {
    setLoading(true);
    getActiveRecruitments()
      .then((response) => {
        setRecruitments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error); //TODO: remove. DO IN issue #1114
      });
  }, []);

  const recruitmentCards = () => {
    if (recruitments) {
      return recruitments.map((recruitment) => (
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
      ));
    } else {
      return (
        <Text as={'strong'} size={'xl'}>
          {t(KEY.recruitment_no_active)}
        </Text>
      );
    }
  };

  return (
    <Page>
      <div className={styles.container}>
        {loading ? (
          <SamfundetLogoSpinner />
        ) : (
          <>
            <Text as={'strong'} size={'l'}>
              {t(KEY.recruitment_active)}
            </Text>
            <div className={styles.cardContainer}>{recruitmentCards()}</div>
          </>
        )}
      </div>
    </Page>
  );
}
