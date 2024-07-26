import styles from './RecruitmentCard.module.scss';
import { RecruitmentDto } from '~/dto';
import { Text } from '~/Components/Text/Text';
import { useTranslation } from 'react-i18next';
import { useDesktop, useIsDarkTheme } from '~/hooks';
import { Button, Logo } from '~/Components';
import { KEY } from '~/i18n/constants';
import { t } from 'i18next';

type RecruitmentCardProps = {
  recruitment_id?: string;
  recruitment_name_nb?: string;
  recruitment_name_en?: string;
  shown_application_deadline?: string;
  reprioritization_deadline_for_applicant?: string;
  recruitment_organization?: RecruitmentDto['organization'];
  isAuthenticated?: boolean;
};

const organizationInformation = {
  samfundet: {
    orgStyle: styles.cardSamf,
    name: 'Samfundet',
  },
  uka: {
    orgStyle: styles.cardUKA,
    name: 'UKA',
  },
  isfit: {
    orgStyle: styles.cardISFIT,
    name: 'ISFiT',
  },
};

export function RecruitmentCard({
  recruitment_id = '-1',
  recruitment_name_nb = 'N/A',
  recruitment_name_en = 'N/A',
  shown_application_deadline = 'N/A',
  reprioritization_deadline_for_applicant = 'N/A',
  recruitment_organization,
  isAuthenticated = false,
}: RecruitmentCardProps) {
  const { i18n } = useTranslation();
  const isDesktop = useDesktop();
  const isDarkTheme = useIsDarkTheme();

  const applicationCardButtons = (
    <>
      {/*TODO: issue #1114: navigate to correct organization recruitment*/}
      <Button
        theme={'green'}
        onClick={() => {
          alert(
            'SKAL NAVIGERE TIL OVERSIKT OVER VERV FOR ' +
              recruitment_organization +
              ' { id: ' +
              recruitment_id +
              ' }' +
              ' opptak',
          );
        }}
      >
        {'Søk verv hos ' + organizationInformation[recruitment_organization].name ?? 'Søk verv'}
      </Button>
      {/*TODO: issue #1114: navigate to users application overview page*/}
      {isAuthenticated && (
        <Button theme={'blue'} onClick={() => alert('IMPLEMENTER NAVIGASJON TIL BRUKERENS SØKNADER')}>
          Dine søknader
        </Button>
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
        - {organizationInformation[recruitment_organization].name ?? 'N/A'}
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
    <div key={recruitment_id} className={organizationInformation[recruitment_organization].orgStyle ?? styles.card}>
      <div className={styles.cardHeader}>{cardHeaderText}</div>
      <div className={styles.cardContent}>
        <div className={styles.cardItemFirst}>
          <div className={styles.textContainer}>{cardContentText}</div>
          {!isDesktop && (
            <div className={styles.cardItemSecond}>
              {' '}
              <Logo
                color={isDarkTheme ? 'light' : 'org-color'}
                organization={recruitment_organization}
                size={'xsmall'}
              />
            </div>
          )}
        </div>
        {isDesktop && (
          <div className={styles.cardItemSecond}>
            <Logo color={isDarkTheme ? 'light' : 'org-color'} organization={recruitment_organization} size={'small'} />
            <div className={styles.buttonContainer}>{applicationCardButtons}</div>
          </div>
        )}
        {!isDesktop && <div className={styles.buttonContainer}>{applicationCardButtons}</div>}
      </div>
    </div>
  );
}
