import styles from './OrganizationRecruitmentPage.module.scss';
import { RecruitmentTabs, GangTypeContainer } from './Components';
import { Text, Page, Video, Logo, OccupiedFormModal, SamfundetLogoSpinner, ToggleSwitch } from '~/Components';
import { PersonalRow } from '~/Pages/RecruitmentPage';
import { OrgNameType, OrgNameTypeValue } from '~/types';
import { useDesktop } from '~/hooks';
import { useParams } from 'react-router-dom';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useOrganizationContext } from '~/context/OrgContextProvider';
import { RecruitmentDto } from '~/dto';
import { getOrganization, getRecruitment } from '~/api';
import classNames from 'classnames';

export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const embededId = '-nYQb8_TvQ4'; // TODO: DO IN ISSUE #1121. Make this dynamic
  const { recruitmentID } = useParams<{ recruitmentID: string }>();
  const [viewAllPositions, setViewAllPositions] = useState<boolean>(true);
  const { t } = useTranslation();
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
    setViewAllPositions(toggledValue);
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
              {dbT(recruitment, 'name')}
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
            className={classNames(
              organizationName === 'Samfundet' && styles.samfRecruitment,
              organizationName === 'UKA' && styles.ukaRecruitment,
              organizationName === 'ISFiT' && styles.isfitRecruitment,
              styles.basicRecruitment,
            )}
          >
            <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
              {t(KEY.recruitment_apply_for)} {organizationName}
            </Text>
          </div>
          <div className={styles.personalRow}>
            {recruitmentID && (
              <>
                <OccupiedFormModal recruitmentId={+recruitmentID} />
                <PersonalRow
                  recruitmentID={recruitmentID}
                  organizationName={organizationName}
                  showRecruitmentBtn={false}
                />
              </>
            )}
          </div>
          <div className={styles.openPositionsContainer}>
            <div className={styles.displayOptionsContainer}>
              <ToggleSwitch checked={viewAllPositions} onChange={toggleViewAll} />
              <Text>Placeholder for tag-autocomplete search</Text>
            </div>
            {recruitmentID &&
              (viewAllPositions ? <GangTypeContainer recruitmentID={recruitmentID} /> : <RecruitmentTabs />)}
          </div>
        </div>
      )}
    </Page>
  );
}
