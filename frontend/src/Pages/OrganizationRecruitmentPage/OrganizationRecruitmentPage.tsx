import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Logo, OccupiedFormModal, Page, SamfundetLogoSpinner, Text, Video } from '~/Components';
import { PersonalRow } from '~/Pages/RecruitmentPage';
import { getRecruitment } from '~/api';
import { useOrganizationContext } from '~/context/OrgContextProvider';
import type { RecruitmentDto } from '~/dto';
import { useDesktop, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { OrgNameType, type OrgNameTypeValue } from '~/types';
import { dbT } from '~/utils';
import { GangSeparatePositions, GangTypeContainer, RecruitmentTabs } from './Components';
import styles from './OrganizationRecruitmentPage.module.scss';

type ViewMode = 'list' | 'tab';

const ORG_STYLES = {
  [OrgNameType.SAMFUNDET_NAME]: {
    subHeaderStyle: styles.samfRecruitmentSubHeader,
  },
  [OrgNameType.UKA_NAME]: {
    subHeaderStyle: styles.ukaRecruitmentSubHeader,
  },
  [OrgNameType.ISFIT_NAME]: {
    subHeaderStyle: styles.isfitRecruitmentSubHeader,
  },
  [OrgNameType.FALLBACK]: {
    subHeaderStyle: '',
  },
};

export function OrganizationRecruitmentPage() {
  const isDesktop = useDesktop();
  const { recruitmentId } = useParams<{ recruitmentId: string }>();
  const [viewAllPositions, setViewAllPositions] = useState<boolean>(true);
  const { t } = useTranslation();
  const { changeOrgTheme, organizationTheme } = useOrganizationContext();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const [positionsViewMode, setViewMode] = useState<ViewMode>('list');

  useTitle(dbT(recruitment, 'name') ?? '');

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
      changeOrgTheme(recruitment.organization.name as OrgNameTypeValue);
    }
    setLoading(false);
  }, [recruitment, changeOrgTheme]);

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
            <Logo
              organization={(recruitment?.organization.name as OrgNameTypeValue) ?? OrgNameType.FALLBACK}
              color="light"
              size={isDesktop ? 'small' : 'xsmall'}
            />
            <Text as="strong" size={isDesktop ? 'xl' : 'l'}>
              {dbT(recruitment, 'name')}
            </Text>
          </div>
          {recruitment?.promo_media && <Video embedId={recruitment.promo_media} className={styles.video} />}
          <div
            className={classNames(
              ORG_STYLES[(recruitment?.organization.name as OrgNameTypeValue) ?? OrgNameType.FALLBACK].subHeaderStyle,
              styles.basicRecruitmentSubHeader,
            )}
          >
            <Text as={'strong'} size={isDesktop ? 'xl' : 'l'}>
              {t(KEY.recruitment_apply_for)} {recruitment?.organization.name}
            </Text>
          </div>
          <div className={styles.personalRow}>
            {recruitmentId && (
              <>
                <OccupiedFormModal recruitmentId={+recruitmentId} />
                <PersonalRow
                  recruitmentId={recruitmentId}
                  organizationName={recruitment?.organization.name}
                  showRecruitmentBtn={false}
                />
              </>
            )}
          </div>
          <div className={styles.openPositionsWrapper}>
            <div className={styles.optionsContainer}>
              <div className={styles.viewModeControll}>
                <Button
                  theme={positionsViewMode === 'list' ? 'selected' : 'outlined'}
                  onClick={() => setViewMode('list')}
                >
                  {t(KEY.common_list_view)}
                </Button>
                <Button
                  theme={positionsViewMode === 'tab' ? 'selected' : 'outlined'}
                  onClick={() => setViewMode('tab')}
                >
                  {t(KEY.common_tab_view)}
                </Button>
              </div>
            </div>
            {recruitmentId && (positionsViewMode === 'list' ? <GangTypeContainer /> : <RecruitmentTabs />)}
            {recruitment?.separate_positions && recruitment.separate_positions.length > 0 && (
              <GangSeparatePositions recruitmentSeparatePositions={recruitment.separate_positions} />
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
