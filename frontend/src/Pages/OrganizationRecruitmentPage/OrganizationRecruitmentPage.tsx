import styles from './OrganizationRecruitmentPage.module.scss';
import { Text, Page, Video, Logo, OccupiedFormModal, RadioButton, SamfundetLogoSpinner } from '~/Components';
import { OrgNameType, OrgNameTypeValue } from '~/types';
import { useDesktop } from '~/hooks';
import { RecruitmentTabs, GangTypeContainer } from './Components';
import { useParams } from 'react-router-dom';
//import { KEY } from '~/i18n/constants';
//import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useOrganizationContext } from '~/context/OrgContextProvider';
import { RecruitmentDto } from '~/dto';
import { getOrganization, getRecruitment } from '~/api';

export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const embededId = '-nYQb8_TvQ4'; // TODO: DO IN ISSUE #1114. Make this dynamic
  const { recruitmentID } = useParams<{ recruitmentID: string }>();

  const [viewAllPositions, setViewAllPositions] = useState<boolean>(true);
  const [viewGangCategories, setViewGangCategories] = useState<boolean>(false);
  // const { t } = useTranslation();
  const { changeOrgTheme, organizationTheme } = useOrganizationContext();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [organizationName, setOrganizationName] = useState<OrgNameTypeValue>(OrgNameType.FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (recruitmentID) {
      getRecruitment(recruitmentID)
        .then((response) => {
          setRecruitment(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [recruitmentID]);

  useEffect(() => {
    if (recruitment) {
      getOrganization(recruitment.organization)
        .then((response) => {
          if (Object.values(OrgNameType).includes(response.name as OrgNameTypeValue)) {
            setOrganizationName(response.name as OrgNameTypeValue);
          }
        })
        .catch((error) => {
          console.log(error);
          setOrganizationName(OrgNameType.FALLBACK);
        });
    }
    setLoading(false);
  }, [recruitment]);

  useEffect(() => {
    if (organizationName) {
      changeOrgTheme(organizationName);
    }
  }, [organizationName, changeOrgTheme]);

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
      {loading ? (
        <SamfundetLogoSpinner />
      ) : (
        <div className={styles.container}>
          <div className={styles.organizationHeader} style={{ backgroundColor: organizationTheme?.pagePrimaryColor }}>
            <Logo organization={organizationName} color={'light'} size={'small'} />

            <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
              {recruitment?.name_nb}
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
              organizationName === 'Samfundet'
                ? styles.samfRecruitment
                : organizationName === 'UKA'
                ? styles.ukaRecruitment
                : organizationName === 'ISFiT'
                ? styles.isfitRecruitment
                : styles.basicRecruitment
            }
          >
            <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
              Åpne stillinger hos {organizationName}
            </Text>
          </div>
          {recruitmentID && <OccupiedFormModal recruitmentId={+recruitmentID} />}

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
            {recruitmentID &&
              (viewAllPositions ? <GangTypeContainer recruitmentID={recruitmentID} /> : <RecruitmentTabs />)}
          </div>
        </div>
      )}
    </Page>
  );
}
