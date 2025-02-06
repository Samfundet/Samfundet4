import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IconButton, Page, SamfundetLogoSpinner, Text, Video } from '~/Components';
import { PersonalRow } from '~/Pages/RecruitmentPage';
import { getRecruitment } from '~/api';
import { TextItem } from '~/constants';
import { useOrganizationContext } from '~/context/OrgContextProvider';
import type { RecruitmentDto } from '~/dto';
import { useDesktop, useTextItem, useTitle } from '~/hooks';
import { COLORS, OrgNameType, type OrgNameTypeValue } from '~/types';
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
  const { changeOrgTheme } = useOrganizationContext();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const [positionsViewMode, setViewMode] = useState<ViewMode>('list');

  useTitle(dbT(recruitment, 'name') ?? '');

  const samfText = useTextItem(TextItem.samf_recruitment_description);
  const ukaText = useTextItem(TextItem.uka_recruitment_description);
  const isfitText = useTextItem(TextItem.isfit_recruitment_description);
  const fallbackText = useTextItem(TextItem.uka_recruitment_description); // Default

  const descriptionText = (() => {
    switch (recruitment?.organization.name as OrgNameTypeValue) {
      case OrgNameType.SAMFUNDET_NAME:
        return samfText;
      case OrgNameType.UKA_NAME:
        return ukaText;
      case OrgNameType.ISFIT_NAME:
        return isfitText;
      default:
        return fallbackText;
    }
  })();

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

  if (loading) {
    return <SamfundetLogoSpinner />;
  }

  return (
    <Page className={styles.recruitmentPage}>
      <div className={styles.container}>
        <Text as="strong" size={isDesktop ? 'xl' : 'l'}>
          {dbT(recruitment, 'name')}
        </Text>
        {recruitment?.promo_media && <Video embedId={recruitment.promo_media} className={styles.video} />}

        <Text as={'strong'} size={'m'}>
          {descriptionText}
        </Text>
      </div>
      <div className={styles.openPositionsWrapper}>
        <div className={styles.optionsContainer}>
          {recruitmentId && (
            <PersonalRow
              recruitmentId={recruitmentId}
              organizationName={recruitment?.organization.name}
              showRecruitmentBtn={false}
            />
          )}
          <div className={styles.viewModeControll}>
            <IconButton
              title=""
              color={positionsViewMode === 'list' ? COLORS.black : COLORS.grey_35}
              avatarColor={positionsViewMode === 'list' ? COLORS.white : COLORS.white}
              onClick={() => setViewMode('list')}
              icon={'material-symbols:view-list'}
            />
            <IconButton
              title=""
              color={positionsViewMode === 'tab' ? COLORS.black : COLORS.grey_35}
              onClick={() => setViewMode('tab')}
              icon={'material-symbols:tabs-outline-rounded'}
            />
          </div>
        </div>
        {recruitmentId && (positionsViewMode === 'list' ? <GangTypeContainer /> : <RecruitmentTabs />)}
        {recruitment?.separate_positions && recruitment.separate_positions.length > 0 && (
          <GangSeparatePositions recruitmentSeparatePositions={recruitment.separate_positions} />
        )}
      </div>
    </Page>
  );
}
