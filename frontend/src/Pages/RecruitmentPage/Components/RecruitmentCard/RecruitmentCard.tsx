import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Logo, SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { PersonalRow } from '~/Pages/RecruitmentPage/Components/PersonalRow/PersonalRow';
import { getOrganization } from '~/api';
import { useDesktop, useIsDarkTheme } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { OrgNameType, type OrgNameTypeValue } from '~/types';
import styles from './RecruitmentCard.module.scss';

type RecruitmentCardProps = {
  recruitment_id?: string;
  recruitment_name?: string;
  shown_application_deadline?: string;
  reprioritization_deadline_for_applicant?: string;
  organization_name?: OrgNameTypeValue;
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
  recruitment_name = 'N/A',
  shown_application_deadline = 'N/A',
  reprioritization_deadline_for_applicant = 'N/A',
  organization_name = OrgNameType.FALLBACK,
}: RecruitmentCardProps) {
  const isDesktop = useDesktop();
  const isDarkTheme = useIsDarkTheme();

  const cardHeaderText = (
    <Text size={isDesktop ? 'l' : 'm'} as="strong">
      {recruitment_name}
    </Text>
  );

  const cardContentText = (
    <>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.recruitment_organization)}
        </Text>
        {organization_name}
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

  return (
    <div key={recruitment_id} className={CARD_STYLE[organization_name].orgStyle}>
      <div className={styles.cardHeader}>{cardHeaderText}</div>
      <div className={styles.cardText}>{cardContentText}</div>
      <div className={styles.cardLogo}>
        <Logo
          color={isDarkTheme ? 'light' : 'org-color'}
          organization={organization_name}
          size={isDesktop ? 'small' : 'xsmall'}
        />
      </div>
      <div className={styles.personalRow}>
        <PersonalRow recruitmentId={recruitment_id} organizationName={organization_name} />
      </div>
    </div>
  )
}
