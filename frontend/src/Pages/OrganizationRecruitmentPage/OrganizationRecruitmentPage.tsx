import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Logo, OccupiedFormModal, Page, SamfundetLogoSpinner, Text, ToggleSwitch, Video } from '~/Components';
import { PersonalRow } from '~/Pages/RecruitmentPage';
import { getOrganization, getRecruitment } from '~/api';
import { useOrganizationContext } from '~/context/OrgContextProvider';
import type { RecruitmentDto } from '~/dto';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { OrgNameType, type OrgNameTypeValue } from '~/types';
import { dbT, getObjectFieldOrNumber } from '~/utils';
import { GangSeparatePositions, GangTypeContainer, RecruitmentTabs } from './Components';
import styles from './OrganizationRecruitmentPage.module.scss';

export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const embededId = '-nYQb8_TvQ4'; // TODO: Make this dynamic DO IN ISSUE #1121 for backend. #1274 for frontend
  const { recruitmentId } = useParams<{ recruitmentId: string }>();
  const [viewAllPositions, setViewAllPositions] = useState<boolean>(true);
  const { t } = useTranslation();
  const { changeOrgTheme, organizationTheme } = useOrganizationContext();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [organizationName, setOrganizationName] = useState<OrgNameTypeValue>(OrgNameType.FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (recruitmentId) {
      getRecruitment(recruitmentId)
        .then((response) => {
          setRecruitment(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [recruitmentId]);

  useEffect(() => {
    if (recruitment) {
      getOrganization(getObjectFieldOrNumber<number>(recruitment.organization, 'id'))
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
    <Page className={styles.recruitmentPage}>
      {loading ? (
        <SamfundetLogoSpinner />
      ) : (
        <div className={styles.container}>
          <div className={styles.organizationHeader} style={{ backgroundColor: organizationTheme?.pagePrimaryColor }}>
            <Logo organization={organizationName} color="light" size={isDesktop ? 'small' : 'xsmall'} />
            <Text as="strong" size={isDesktop ? 'xl' : 'l'}>
              {dbT(recruitment, 'name')}
            </Text>
          </div>
          {embededId ? (
            <>
              <Video embedId={embededId} className={styles.video} />
            </>
          ) : (
            <></>
          )}
          <div
            className={classNames(
              organizationName === 'Samfundet' && styles.samfRecruitmentSubHeader,
              organizationName === 'UKA' && styles.ukaRecruitmentSubHeader,
              organizationName === 'ISFiT' && styles.isfitRecruitmentSubHeader,
              styles.basicRecruitmentSubHeader,
            )}
          >
            <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
              {t(KEY.recruitment_apply_for)} {organizationName}
            </Text>
          </div>
          <div className={styles.personalRow}>
            {recruitmentId && (
              <>
                <OccupiedFormModal recruitmentId={+recruitmentId} />
                <PersonalRow
                  recruitmentId={recruitmentId}
                  organizationName={organizationName}
                  showRecruitmentBtn={false}
                />
              </>
            )}
          </div>
          <div className={styles.openPositionsWrapper}>
            <div className={styles.optionsContainer}>
              <ToggleSwitch checked={viewAllPositions} onChange={toggleViewAll} />
              <Text>Placeholder for tag-autocomplete search </Text>
              {/*^^^ issue #1275 */}
            </div>
            {recruitmentId &&
              (viewAllPositions ? <GangTypeContainer recruitmentId={recruitmentId} /> : <RecruitmentTabs />)}
            {recruitment?.separate_positions && recruitment.separate_positions.length > 0 && (
              <GangSeparatePositions recruitmentSeparatePositions={recruitment.separate_positions} />
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
