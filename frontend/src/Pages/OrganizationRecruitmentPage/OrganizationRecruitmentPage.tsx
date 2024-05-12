import styles from './OrganizationRecruitmentPage.module.scss';
import { Text, Page, Video, SamfLogo, UkaLogo, IsfitLogo } from '~/Components';

import { COLORS, SAMFUNDET_NAME, UKA_NAME, ISFIT_NAME, OrganizationTypeValue } from '~/types';
import { useDesktop } from '~/hooks';

import { GangTypeTabs } from '~/Pages/OrganizationRecruitmentPage/Components/GangTypeTabs/GangTypeTabs';

//TODO: Fix translations. DO IN #1117
export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const organization: OrganizationTypeValue = 'samfundet';
  const embededId = '-nYQb8_TvQ4';

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
            Opptak navn placeholder
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
            Opptak hos{' '}
            {organization === 'samfundet'
              ? SAMFUNDET_NAME
              : organization === 'uka'
              ? UKA_NAME
              : organization === 'isfit'
              ? ISFIT_NAME
              : 'missing organization'}
          </Text>
          <input
            placeholder={'SØK PÅ TAG PLACEHOLDER'}
            type={'text'}
            onClick={() => {
              alert(
                'multiselect for å filtrere verv. Her kan det være hensiktsmessig at' +
                  ' man viser en tabell med ALL verv når en eller flere tags er valgt. ' +
                  'Legg til ekstra desing på multiselect: mer som en dropdown',
              );
            }}
          />
        </div>
        <div className={styles.openPositionsContainer}>
          {/*
          GangTypeTabs contains a nested TabBar component, which contains a table component
          */}
          <GangTypeTabs />
        </div>
      </div>
    </Page>
  );
}
