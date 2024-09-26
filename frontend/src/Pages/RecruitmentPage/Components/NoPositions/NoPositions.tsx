import { t } from 'i18next';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './NoPositions.module.scss';
import { OrgNameType, OrgNameTypeValue } from '~/types';

type NoRecruitmentProps = {
  organization?: Exclude<OrgNameTypeValue, typeof OrgNameType.FALLBACK>;
};

const SamfNoRecruitmentValuesDict = {
  header: TextItem.no_recruitment_samf_header,
  about: TextItem.no_recruitment_samf_about,
  next: TextItem.no_recruitment_samf_next,
};

const UkaNoRecruitmentValuesDict = {
  header: TextItem.no_recruitment_uka_header,
  about: TextItem.no_recruitment_uka_about,
  next: TextItem.no_recruitment_uka_next,
};

const IsfitNoRecruitmentValuesDict = {
  header: TextItem.no_recruitment_isfit_header,
  about: TextItem.no_recruitment_isfit_about,
  next: TextItem.no_recruitment_isfit_next,
};

const OrganizationToDictionary = {
  [OrgNameType.SAMFUNDET_NAME]: SamfNoRecruitmentValuesDict,
  [OrgNameType.UKA_NAME]: UkaNoRecruitmentValuesDict,
  [OrgNameType.ISFIT_NAME]: IsfitNoRecruitmentValuesDict,
};

export function NoPositions({ organization = OrgNameType.SAMFUNDET_NAME }: NoRecruitmentProps) {
  const thisOrganization = OrganizationToDictionary[organization];
  return (
    <div className={styles.no_recruitment_wrapper}>
      <div>
        <h1 className={styles.header}>{useTextItem(thisOrganization.header)}</h1>
      </div>
      <div className={styles.info}>
        <p>
          <br />
          {useTextItem(thisOrganization.about)}
          <br />
          {useTextItem(thisOrganization.next)}
          <br />
          <br />
        </p>
      </div>
    </div>
  );
}
