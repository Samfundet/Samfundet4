import styles from './RecruitmentCard.module.scss';
import { Text } from '~/Components/Text/Text';
import { useTranslation } from 'react-i18next';
import { useDesktop, useIsDarkTheme } from '~/hooks';
import { Button, IsfitLogo, SamfLogo, UkaLogo } from '~/Components';
import { KEY } from '~/i18n/constants';
import { t } from 'i18next';
import { ROUTES } from '~/routes';
import { useNavigate } from 'react-router-dom';
import { reverse } from '~/named-urls';

type RecruitmentCardProps = {
  recruitment_id?: string;
  recruitment_name_nb?: string;
  recruitment_name_en?: string;
  shown_application_deadline?: string;
  reprioritization_deadline_for_applicant?: string;
  recruitment_organization: number;
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

  //TODO: IN ISSUE #689. Create organization style theme.
  const setOrganizationStyle = (org: number | undefined) => {
    switch (org) {
      case 1:
        return styles.cardSamf;
      case 2:
        return styles.cardUKA;
      case 3:
        return styles.cardISFIT;
      default:
        return styles.card;
    }
  };

  const applicationCardButtons = (
    <>
      <Button
        theme={'green'}
        onClick={() => {
          const path = reverse({
            pattern: ROUTES.frontend.organization_recruitment_list,
            urlParams: { recruitmentID: recruitment_id },
          });
          if (path) {
            navigate(path);
          } else {
            navigate(path);
          }
        }}
      >
        {recruitment_organization === 1
          ? 'Søk verv hos ' + SAMFUNDET
          : recruitment_organization === 2
          ? 'Søk verv hos ' + UKA
          : recruitment_organization === 3
          ? 'Søk verv hos ' + ISFIT
          : 'Søk verv'}
      </Button>
      {/*TODO: issue #1114: navigate to users application overview page*/}
      {isAuthenticated && (
        <>
          <Button
            theme="samf"
            onClick={() => {
              const path = reverse({
                pattern: ROUTES.frontend.recruitment_application_overview,
                urlParams: { recruitmentID: recruitment_id },
              });
              if (path) {
                navigate(path);
              } else {
                navigate(ROUTES.frontend.not_found);
              }
            }}
          >
            Dine søknader
            {/*TODO: ^ IN ISSUE #689, translations*/}
          </Button>
        </>
      )}
    </>
  );

  const organizationLogo = (
    <>
      {recruitment_organization === 1 && (
        <SamfLogo color={isDarkTheme ? 'light' : 'red-samf'} size={isDesktop ? 'medium' : 'small'} />
      )}
      {recruitment_organization === 2 && (
        <UkaLogo color={isDarkTheme ? 'light' : 'blue-uka'} size={isDesktop ? 'medium' : 'small'} />
      )}
      {recruitment_organization === 3 && (
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
        {recruitment_organization === 1
          ? SAMFUNDET
          : recruitment_organization === 2
          ? UKA
          : recruitment_organization === 3
          ? ISFIT
          : 'N/A'}
      </Text>
      <Text size={'m'} as={'p'}>
        <Text size={'m'} as={'strong'}>
          {t(KEY.application_deadline)}:
        </Text>{' '}
        - {shown_application_deadline}
        {/*TODO: ^ IN ISSUE #689, use TimeDisplay component*/}
      </Text>
      <Text size={'m'} as={'p'}>
        <Text size={'m'} as={'strong'}>
          {t(KEY.reprioritization_deadline_for_applicant)}:
        </Text>{' '}
        - {reprioritization_deadline_for_applicant}
        {/*TODO: ^ IN ISSUE #689, use TimeDisplay component*/}
      </Text>
    </>
  );

  return (
    <div key={recruitment_id} className={setOrganizationStyle(recruitment_organization)}>
      {/*TODO: IN ISSUE #689. Create organization style theme.*/}

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
