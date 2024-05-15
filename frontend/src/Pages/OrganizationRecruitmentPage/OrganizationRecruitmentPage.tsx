import styles from './OrganizationRecruitmentPage.module.scss';
import { Text, Page, Video, SamfLogo, UkaLogo, IsfitLogo } from '~/Components';
import { COLORS, SAMFUNDET_NAME, UKA_NAME, ISFIT_NAME, OrganizationTypeValue } from '~/types';
import { useDesktop } from '~/hooks';
import { RecruitmentTabs } from '~/Pages/OrganizationRecruitmentPage/Components/RecruitmentTabs/RecruitmentTabs';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { useParams } from 'react-router-dom';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';

export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const organization: OrganizationTypeValue = 'samfundet'; // TODO: DO IN ISSUE #1114. Make this dynamic
  const embededId = '-nYQb8_TvQ4'; // TODO: DO IN ISSUE #1114. Make this dynamic
  const recruitmentID = useParams();
  const { t } = useTranslation();

  //TODO: IN ISSUE #689. Create organization style theme.

  return (
    <Page>
      <div className={styles.container}>
        <div
          className={styles.organizationHeader}
          style={
            organization === 'samfundet'
              ? { backgroundColor: COLORS.red_samf }
              : organization === 'uka'
              ? { backgroundColor: COLORS.blue_uka }
              : organization === 'isfit'
              ? { backgroundColor: COLORS.blue_isfit }
              : { color: 'black' }
          }
        >
          {organization === 'samfundet' ? (
            <SamfLogo color={'light'} />
          ) : organization === 'uka' ? (
            <UkaLogo color={'light'} />
          ) : organization === 'isfit' ? (
            <IsfitLogo color={'light'} />
          ) : null}
          <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
            {t(KEY.recruitment_organization)} #### placeholder
          </Text>
        </div>
        {embededId ? (
          <>
            <Video embedId={embededId} className={styles.video}></Video>
          </>
        ) : (
          <></>
        )}
        <div
          className={
            organization === 'samfundet'
              ? styles.samfRecruitment
              : organization === 'uka'
              ? styles.ukaRecruitment
              : organization === 'isfit'
              ? styles.isfitRecruitment
              : styles.basicRecruitment
          }
        >
          {' '}
          <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
            {t(KEY.recruitment_active) + ' '}
            {organization === 'samfundet'
              ? SAMFUNDET_NAME
              : organization === 'uka'
              ? UKA_NAME
              : organization === 'isfit'
              ? ISFIT_NAME
              : 'missing organization'}
          </Text>
        </div>
        <OccupiedFormModal recruitmentId={recruitmentID} />
        <div className={styles.openPositionsContainer}>
          <RecruitmentTabs />
        </div>
      </div>
    </Page>
  );
}
