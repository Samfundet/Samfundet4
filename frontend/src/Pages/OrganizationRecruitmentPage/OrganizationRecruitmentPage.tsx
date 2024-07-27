import styles from './OrganizationRecruitmentPage.module.scss';
import { Text, Page, Video, Logo, OccupiedFormModal, RadioButton } from '~/Components';
import { COLORS, OrganizationTypeValue, OrgNameTypeValue } from '~/types';
import { useDesktop } from '~/hooks';
import { RecruitmentTabs, GangTypeContainer } from './Components';
import { useParams } from 'react-router-dom';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const organization: OrganizationTypeValue = 'samfundet'; // TODO: DO IN ISSUE #1114. Make this dynamic
  const embededId = '-nYQb8_TvQ4'; // TODO: DO IN ISSUE #1114. Make this dynamic
  const recruitmentParam = useParams();
  const recruitmentID: number = +recruitmentParam;
  const [viewAllPositions, setViewAllPositions] = useState<boolean>(true);
  const [viewGangCategories, setViewGangCategories] = useState<boolean>(false);
  const { t } = useTranslation();

  function toggleViewAll() {
    const toggledValue = !viewAllPositions;
    setViewGangCategories(false);
    setViewAllPositions(toggledValue);
  }

  function toggleViewGangCategories() {
    const toggleValue = !viewGangCategories;
    setViewAllPositions(false);
    setViewGangCategories(toggleValue);
  }

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
          {
            <Logo organization={'Samfundet'} color={'light'} size={'small'} />
            /*  organization === 'samfundet' ? (
            <SamfLogo color={'light'} />
          ) : organization === 'uka' ? (
            <UkaLogo color={'light'} />
          ) : organization === 'isfit' ? (
            <IsfitLogo color={'light'} />
          ) : null*/
          }
          <Logo organization={'Samfundet'} color={'light'} size={'small'} />
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

            {
              /*organization === 'samfundet'
              ? SAMFUNDET_NAME
              : organization === 'uka'
              ? UKA_NAME
              : organization === 'isfit'
              ? ISFIT_NAME
              : */

              'missing organization'
            }
          </Text>
        </div>
        <OccupiedFormModal recruitmentId={recruitmentID} />
        <div className={styles.openPositionsContainer}>
          <div className={styles.displayOptionsWrapper}>
            <Text size={'l'} as={'p'}>
              Vis verv:
            </Text>
            <hr className={styles.displayOptionsDivider}></hr>
            <div className={styles.displayOptions}>
              <RadioButton checked={viewAllPositions} onChange={toggleViewAll}>
                Alle
              </RadioButton>
              <RadioButton checked={viewGangCategories} onChange={toggleViewGangCategories}>
                Kategorisert etter gjeng
              </RadioButton>
            </div>
          </div>

          {viewAllPositions && <GangTypeContainer recruitmentID={recruitmentID} />}
          {viewGangCategories && <RecruitmentTabs />}
        </div>
      </div>
    </Page>
  );
}
