import { COLORS } from '~/types';
import styles from '../OrganizationRecruitmentPage.module.scss';
import { SamfLogo, UkaLogo, IsfitLogo } from '~/Components';

export const organizationConfig = {
  samfundet: {
    backgroundColor: COLORS.red_samf,
    logo: <SamfLogo color={'light'} />,
    recruitmentClass: styles.samfRecruitment,
  },
  uka: {
    backgroundColor: COLORS.blue_uka,
    logo: <UkaLogo color={'light'} />,
    recruitmentClass: styles.ukaRecruitment,
  },
  isfit: {
    backgroundColor: COLORS.blue_isfit,
    logo: <IsfitLogo color={'light'} />,
    recruitmentClass: styles.ukaRecruitment,
  },
};

export const defaultStyle = {
  color: 'black',
  logo: null,
  recruitmentClass: styles.basicRecruitment,
};

// Use the configuration object in your component
//const { backgroundColor, logo, recruitmentClass } = organizationConfig[organization] || defaultStyle;
