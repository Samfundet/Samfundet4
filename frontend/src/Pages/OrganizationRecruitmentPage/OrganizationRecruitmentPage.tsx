import styles from './OrganizationRecruitmentPage.module.scss';
import {
  Text,
  Page,
  TabBar,
  Tab,
  Video,
  Button,
  SamfundetLogoSpinner,
  SamfLogo,
  UkaLogo,
  IsfitLogo,
} from '~/Components';

import { GangDto, GangTypeDto, SectionDto } from '~/dto';
import { dbT } from '~/utils';
import { useEffect, useState } from 'react';
import { COLORS, SAMFUNDET_NAME, UKA_NAME, ISFIT_NAME } from '~/types';

//import { samf_recruitment_mock_data } from './mock_data/samf_data';
import { uka_mock_data } from '~/Pages/OrganizationRecruitmentPage/mock_data/uka_data';
import { OrganizationTypeValue } from '~/types';
import { useDesktop } from '~/hooks';

//TODO: Fix translations
export function OrganizationRecruitmentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useDesktop();
  const [currentGangTypeTab, setCurrentGangTypeTab] = useState<Tab<GangTypeDto> | undefined>(undefined);
  const [gangs, setGangs] = useState<GangDto[]>([]); // Holds all gangs
  const [currentGangTab, setCurrentGangTab] = useState<Tab<GangDto> | undefined>(undefined);
  const [selectedSections, setSelectedSections] = useState<SectionDto[] | undefined>(undefined);
  const [organization, setOrganization] = useState<OrganizationTypeValue>();

  //const data = samf_recruitment_mock_data;
  const data = uka_mock_data;
  useEffect(() => {
    if (data.recruiting_gang_types.length > 0) {
      setOrganization(data.organization);
      setCurrentGangTypeTab({
        key: data.recruiting_gang_types[0].id,
        label: dbT(data.recruiting_gang_types[0], 'title') ?? '?',
        value: data.recruiting_gang_types[0],
      });
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (currentGangTypeTab) {
      const currentGangs = currentGangTypeTab.value.gangs;
      setGangs(currentGangs);
      if (currentGangs.length > 0) {
        setCurrentGangTab({
          key: currentGangs[0].id,
          label: dbT(currentGangs[0], 'name') ?? '?',
          value: currentGangs[0],
        });
      } else {
        setCurrentGangTab(undefined);
      }
    }
  }, [currentGangTypeTab]);

  useEffect(() => {
    if (currentGangTab) {
      const currenentSections = currentGangTab.value.sections;
      setSelectedSections(currenentSections);
    }
  }, [currentGangTab]);

  const gangTypeTabs: Tab<GangTypeDto>[] = data.recruiting_gang_types.map((gangType) => ({
    key: gangType.id,
    label: dbT(gangType, 'title') ?? '?',
    value: gangType,
  }));

  //TODO: fix translation for this:
  const gangTabs: Tab<GangDto>[] = gangs.map((gang) => ({
    key: gang.id,
    label: dbT(gang, 'name') ?? '?',
    value: gang,
  }));

  const handleSetGangTypeTab = (tab: Tab<GangTypeDto>) => {
    setCurrentGangTypeTab(tab);
  };

  const handleSetGangTab = (tab: Tab<GangDto>) => {
    setCurrentGangTab(tab);
  };

  //const tags = getTags(samf_recruitment_mock_data);
  //console.log(tags);

  const RecruitmentTable = (selectedSections: SectionDto[] | undefined) => {
    if (!selectedSections || selectedSections.length === 0) {
      return <p>💥No data available. 💥</p>;
    }
    return (
      <table className={styles.recruitmentTable}>
        <thead>
          <tr>
            <th>Seksjon</th>
            <th>Verv</th>
            <th>Beskrivelse</th>
          </tr>
        </thead>
        <tbody>
          {selectedSections.map((section) =>
            section.recruitment_positions.map((position, index) => (
              <tr key={position.id}>
                {index === 0 && (
                  <th className={styles.sectionName} rowSpan={section.recruitment_positions.length}>
                    {section.section_name_nb}
                  </th>
                )}
                <td>
                  <Button
                    theme={'samf'}
                    className={styles.positionButton}
                    onClick={() => {
                      alert(
                        'Naviger til vervets side, hvor det skal finnes et skjema å fylle ut. vervets id: ' +
                          position.id,
                      );
                    }}
                  >
                    <Text as={'strong'} size={'m'}>
                      {position.name_nb}{' '}
                    </Text>
                  </Button>
                </td>
                <td>{position.short_description_nb}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    );
  };

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

        {isLoading ? (
          <SamfundetLogoSpinner />
        ) : (
          <>
            <Video embedId="-nYQb8_TvQ4" className={styles.video}></Video>
            <div
              className={
                organization === 'samfundet'
                  ? styles.samfRecruitment
                  : organization === 'uka'
                  ? styles.ukaRecruitment
                  : organization === 'isfit'
                  ? styles.ukaRecruitment
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
            </div>
            <div className={styles.openPositionsContainer}>
              <TabBar tabs={gangTypeTabs} selected={currentGangTypeTab} onSetTab={handleSetGangTypeTab} />
              <TabBar tabs={gangTabs} selected={currentGangTab} onSetTab={handleSetGangTab} />
              {selectedSections && <>{RecruitmentTable(selectedSections)}</>}
            </div>
          </>
        )}
      </div>
    </Page>
  );
}
