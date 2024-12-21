import { t } from 'i18next';
import { Logo, TimeDisplay } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { PersonalRow } from '~/Pages/RecruitmentPage/Components/PersonalRow/PersonalRow';
import type { RecruitmentDto } from '~/dto';
import { useDesktop, useIsDarkTheme } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { OrgNameType, type OrgNameTypeValue } from '~/types';
import { dbT } from '~/utils';
import styles from './RecruitmentCard.module.scss';

type RecruitmentCardProps = {
  recruitment: RecruitmentDto;
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

export function RecruitmentCard({ recruitment }: RecruitmentCardProps) {
  const isDesktop = useDesktop();
  const isDarkTheme = useIsDarkTheme();

  const cardHeaderText = (
    <Text size={isDesktop ? 'l' : 'm'} as="strong">
      {dbT(recruitment, 'name')}
    </Text>
  );

  const cardContentText = (
    <>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.recruitment_organization)}
        </Text>
        {recruitment.organization.name}
      </Text>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.application_deadline)}:
        </Text>
        <TimeDisplay
          timestamp={recruitment.shown_application_deadline}
          displayType="nice-date"
          className={styles.timeDisplay}
        />
        {', '}
        <TimeDisplay
          timestamp={recruitment.shown_application_deadline}
          displayType="time"
          className={styles.timeDisplay}
        />
      </Text>
      <Text size="m" as="p">
        <Text size="m" as="strong">
          {t(KEY.reprioritization_deadline_for_applicant)}:
        </Text>
        <TimeDisplay
          timestamp={recruitment.reprioritization_deadline_for_applicant}
          displayType="nice-date"
          className={styles.timeDisplay}
        />
        {', '}
        <TimeDisplay
          timestamp={recruitment.reprioritization_deadline_for_applicant}
          displayType="time"
          className={styles.timeDisplay}
        />
      </Text>
    </>
  );

  return recruitment.id ? (
    <div key={recruitment.id} className={CARD_STYLE[recruitment.organization.name as OrgNameTypeValue].orgStyle}>
      <div className={styles.cardHeader}>{cardHeaderText}</div>
      <div className={styles.cardText}>{cardContentText}</div>
      <div className={styles.cardLogo}>
        <Logo
          color={isDarkTheme ? 'light' : 'org-color'}
          organization={recruitment.organization.name as OrgNameTypeValue}
          size={isDesktop ? 'small' : 'xsmall'}
        />
      </div>
      <div className={styles.personalRow}>
        <PersonalRow
          recruitmentId={recruitment.id}
          organizationName={recruitment.organization.name as OrgNameTypeValue}
        />
      </div>
    </div>
  ) : (
    <></>
  );
}
