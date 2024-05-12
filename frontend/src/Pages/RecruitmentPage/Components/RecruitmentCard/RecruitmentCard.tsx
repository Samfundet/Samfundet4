import styles from './RecruitmentCard.module.scss';
import { RecruitmentDto } from '~/dto';
import { Text } from '~/Components/Text/Text';
import { useTranslation } from 'react-i18next';
import { useDesktop, useIsDarkTheme } from '~/hooks';
import { Button, IsfitLogo, SamfLogo, UkaLogo } from '~/Components';
import { KEY } from '~/i18n/constants';
import { t } from 'i18next';
import { ROUTES } from '~/routes';
import { useNavigate } from 'react-router-dom';

type RecruitmentCardProps = {
  recruitment_id?: string;
  recruitment_name_nb?: string;
  recruitment_name_en?: string;
  shown_application_deadline?: string;
  reprioritization_deadline_for_applicant?: string;
  recruitment_organization?: RecruitmentDto['organization'];
  isAuthenticated?: boolean;
};

export function RecruitmentCard({
  recruitment_id = '-1',
  recruitment_name_nb = 'N/A 💥',
  recruitment_name_en = 'N/A 💥',
  shown_application_deadline = 'N/A 💥',
  reprioritization_deadline_for_applicant = 'N/A 💥',
  recruitment_organization,
  isAuthenticated = false,
}: RecruitmentCardProps) {
  const { i18n } = useTranslation();
  const isDesktop = useDesktop();
  const isDarkTheme = useIsDarkTheme();
  const navigate = useNavigate();

  const SAMFUNDET = 'Samfundet';
  const ISFIT = 'ISFiT';
  const UKA = 'UKA';

  const setOrganizationStyle = (org: 'samfundet' | 'isfit' | 'uka' | undefined) => {
    switch (org) {
      case 'samfundet':
        return styles.cardSamf;
      case 'uka':
        return styles.cardUKA;
      case 'isfit':
        return styles.cardISFIT;
      default:
        return styles.card;
    }
  };

  const applicationCardButtons = (
    <>
      {/*TODO: issue #1114: navigate to correct organization recruitment*/}
      <Button
        theme={'green'}
        onClick={() => {
          navigate(ROUTES.frontend.organization_recruitment_list);
        }}
      >
        {recruitment_organization === 'samfundet'
          ? 'Søk verv hos ' + SAMFUNDET
          : recruitment_organization === 'uka'
          ? 'Søk verv hos ' + UKA
          : recruitment_organization === 'isfit'
          ? 'Søk verv hos ' + ISFIT
          : 'Søk verv'}
      </Button>
      {/*TODO: issue #1114: navigate to users application overview page*/}
      {isAuthenticated && (
        <Button theme={'blue'} onClick={() => alert('IMPLEMENTER NAVIGASJON TIL BRUKERENS SØKNADER')}>
          Dine søknader
        </Button>
      )}
    </>
  );

  const organizationLogo = (
    <>
      {recruitment_organization === 'samfundet' && (
        <SamfLogo color={isDarkTheme ? 'light' : 'red-samf'} size={isDesktop ? 'medium' : 'small'} />
      )}
      {recruitment_organization === 'uka' && (
        <UkaLogo color={isDarkTheme ? 'light' : 'blue-uka'} size={isDesktop ? 'medium' : 'small'} />
      )}
      {recruitment_organization === 'isfit' && (
        <IsfitLogo color={isDarkTheme ? 'light' : 'dark'} size={isDesktop ? 'medium' : 'small'} />
      )}
    </>
  );

  const cardHeaderText = (
    <Text size={isDesktop ? 'l' : 'm'} as="strong">
      {i18n.language === 'nb' ? recruitment_name_nb : recruitment_name_en}
    </Text>
  );

  const cardContentText = (
    <>
      <Text size={'m'} as={'p'}>
        <Text size={'m'} as={'strong'}>
          {t(KEY.recruitment_organization)}
        </Text>{' '}
        -{' '}
        {recruitment_organization === 'samfundet'
          ? SAMFUNDET
          : recruitment_organization === 'uka'
          ? UKA
          : recruitment_organization === 'isfit'
          ? ISFIT
          : 'N/A'}
      </Text>
      <Text size={'m'} as={'p'}>
        <Text size={'m'} as={'strong'}>
          {t(KEY.application_deadline)}:
        </Text>{' '}
        - {shown_application_deadline}
      </Text>
      <Text size={'m'} as={'p'}>
        <Text size={'m'} as={'strong'}>
          {t(KEY.reprioritization_deadline_for_applicant)}:
        </Text>{' '}
        - {reprioritization_deadline_for_applicant}
      </Text>
    </>
  );

  return (
    <div key={recruitment_id} className={setOrganizationStyle(recruitment_organization)}>
      <div className={styles.cardHeader}>{cardHeaderText}</div>
      <div className={styles.cardContent}>
        <div className={styles.cardItemFirst}>
          <div className={styles.textContainer}>{cardContentText}</div>
          {!isDesktop && <div className={styles.cardItemSecond}>{organizationLogo}</div>}
        </div>
        {isDesktop && (
          <div className={styles.cardItemSecond}>
            {organizationLogo}
            <div className={styles.buttonContainer}>{applicationCardButtons}</div>
          </div>
        )}
        {!isDesktop && <div className={styles.buttonContainer}>{applicationCardButtons}</div>}
      </div>
    </div>
  );
}
