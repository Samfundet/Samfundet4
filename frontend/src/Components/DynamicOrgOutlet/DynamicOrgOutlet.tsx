import { useRouteLoaderData } from 'react-router-dom';
import type { RecruitmentLoader } from '~/router/loaders';
import { OrgNameType } from '~/types';
import { IsNumber } from '~/utils';
import { IsfitOutlet } from '../IsfitOutlet/IsfitOutlet';
import { SamfOutlet } from '../SamfOutlet/SamfOutlet';
import { UkaOutlet } from '../UkaOutlet';

export function DynamicOrgOutlet() {
  const data = useRouteLoaderData('publicRecruitment') as RecruitmentLoader | undefined;

  if (IsNumber(data?.recruitment?.organization)) {
    // TODO: This should either check for org, or typing should be fixed
    return <SamfOutlet />;
  }

  if (data?.recruitment?.organization.name === OrgNameType.ISFIT_NAME) {
    return <IsfitOutlet />;
  }

  if (data?.recruitment?.organization.name === OrgNameType.UKA_NAME) {
    return <UkaOutlet />;
  }

  return <SamfOutlet />;
}
