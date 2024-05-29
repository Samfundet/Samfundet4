import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/AuthContext';
import { Button, Link, Page, SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import {
  getRecruitmentAdmissionForApplicant,
  getRecruitmentAdmissionsForRecruiter,
  getRecruitmentPosition,
  getRecruitmentPositionsGang,
  putRecruitmentAdmission,
} from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto, SimpleUserDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentAdmissionFormPage.module.scss';

export function RecruitmentApplicantPage() {
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto>();
  const [otherRecruitmentAdmission, setOtherRecruitmentAdmission] = useState<RecruitmentAdmissionDto[]>();
  const [applicant, setApplicant] = useState<SimpleUserDto>();

  const [loading, setLoading] = useState(true);

  const { admissionID } = useParams();

  useEffect(() => {
    getRecruitmentAdmissionsForRecruiter(admissionID as string)
      .then((res) => {
        setRecruitmentAdmission(res.data.admission);
        setApplicant(res.data.user);
        setOtherRecruitmentAdmission(res.data.other_admissions);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, [admissionID, t]);

  if (loading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <div>Hello</div>
    </Page>
  );
}
