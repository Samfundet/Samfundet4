import styles from './RecruitmentCard.module.scss';
import { Text } from '~/Components/Text/Text';
import { useTranslation } from 'react-i18next';
import { useDesktop, useIsDarkTheme } from '~/hooks';
import { Logo, SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { KEY } from '~/i18n/constants';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { getOrganization } from '~/api';
import { OrgNameTypeValue, OrgNameType } from '~/types';
import { PersonalRow } from '~/Pages/RecruitmentPage/Components/PersonalRow/PersonalRow';

type RecruitmentCardProps = {
  recruitment_id?: string;
  recruitment_name_nb?: string;
  recruitment_name_en?: string;
  shown_application_deadline?: string;
  reprioritization_deadline_for_applicant?: string;
  organization_id: number;
  isAuthenticated?: boolean;
};

const CARD_STYLE = {
  [OrgNameType.SAMFUNDET_NAME]: {
    orgStyle: styles.SamfundetCard,
  },
  [OrgNameType.UKA_NAME]: {
    orgStyle: styles.UKACard,
  },
  [OrgNameType.ISFIT_NAME]: {
    orgStyle: styles.ISFiTCard,
  },
  [OrgNameType.FALLBACK]: {
    orgStyle: styles.card,
  },
};

export function RecruitmentCard({
  recruitment_id = '-1',
  recruitment_name_nb = 'N/A',
  recruitment_name_en = 'N/A',
  shown_application_deadline = 'N/A',
  reprioritization_deadline_for_applicant = 'N/A',
  organization_id,
}: RecruitmentCardProps) {
  const { i18n } = useTranslation();
  const isDesktop = useDesktop();
  const isDarkTheme = useIsDarkTheme();
  const [organizationName, setOrganizationName] = useState<OrgNameTypeValue>(OrgNameType.FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getOrganization(organization_id)
      .then((response) => {
        if (Object.values(OrgNameType).includes(response.name as OrgNameTypeValue)) {
          setOrganizationName(response.name as OrgNameTypeValue);
        } else {
          setOrganizationName(OrgNameType.FALLBACK);
        }
      })
      .catch((error) => {
        console.log(error);
        setOrganizationName(OrgNameType.FALLBACK);
      });
    setLoading(false);
  }, [organization_id]);

  const cardHeaderText = (
    <Text size={isDesktop ? 'l' : 'm'} as="strong">
      {i18n.language === 'nb' ? recruitment_name_nb : recruitment_name_en}
    </Text>
  );

  const cardContentText = (
    <>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.recruitment_organization)}
        </Text>
        {organizationName}
      </Text>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.application_deadline)}:
        </Text>
        <TimeDisplay timestamp={shown_application_deadline} displayType="nice-date" className={styles.timeDisplay} />
        {', '}
        <TimeDisplay timestamp={shown_application_deadline} displayType="time" className={styles.timeDisplay} />
      </Text>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.reprioritization_deadline_for_applicant)}:
        </Text>
        <TimeDisplay
          timestamp={reprioritization_deadline_for_applicant}
          displayType="nice-date"
          className={styles.timeDisplay}
        />
        {', '}
        <TimeDisplay
          timestamp={reprioritization_deadline_for_applicant}
          displayType="time"
          className={styles.timeDisplay}
        />
      </Text>
    </>
  );

  return loading ? (
    <SamfundetLogoSpinner />
  ) : (
    <div key={recruitment_id} className={CARD_STYLE[organizationName].orgStyle}>
      <div className={styles.cardHeader}>{cardHeaderText}</div>
      <div className={styles.cardText}>{cardContentText}</div>
      <div className={styles.cardLogo}>
        {organizationName && (
          <Logo
            color={isDarkTheme ? 'light' : 'org-color'}
            organization={organizationName}
            size={isDesktop ? 'small' : 'xsmall'}
          />
        )}
      </div>
      <div className={styles.personalRow}>
        <PersonalRow recruitmentID={recruitment_id} organizationName={organizationName} />
      </div>
    </div>
  );
}
