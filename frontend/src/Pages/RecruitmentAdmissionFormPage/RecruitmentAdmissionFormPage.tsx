import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import {
  getRecruitmentAdmissionsForApplicant,
  getRecruitmentPosition,
  postRecruitmentAdmission,
  getRecruitment,
} from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto, RecruitmentDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentAdmissionFormPage.module.scss';

export function RecruitmentAdmissionFormPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { positionID, id } = useParams();

  useEffect(() => {
    if (positionID) {
      setRecruitmentPosition(undefined);
      setRecruitment(undefined);
      setAdmissions([]);
      getRecruitmentPosition(positionID).then((response) => {
        setRecruitmentPosition(response.data);
        getRecruitment(response.data.recruitment).then((response) => {
          setRecruitment(response.data);
        }); // TODO: Add error handling
        getRecruitmentAdmissionsForApplicant(response.data.recruitment).then((response) => {
          setAdmissions(response.data);
        }); // TODO: Add error handling
        setLoading(false);
      }); // TODO: Add error handling
    } else {
      setLoading(false);
      // Paramater positionID is not set, redirect or somthing...
    }
  }, [positionID]);

  function handleOnSubmit(data: RecruitmentAdmissionDto) {
    if (!(admissions && positionID && recruitment && recruitmentPosition)) {
      return;
    }

    // if the user has already applied to the recruitment cancel the application.
    if (
      admissions.find((admission) => admission?.recruitment_position?.toString() === recruitmentPosition.id.toString())
    ) {
      toast.error(t(KEY.recruitment_admission_already_applied));
      return;
    }

    // if the user has already applied to the max amount of recruitments cancel the application.
    const max_admitions: number = recruitment.max_applications_per_user;
    if (admissions.length >= max_admitions) {
      toast.error(t(KEY.recruitment_admission_max_applications_per_user));
      return;
    }

    data.recruitment_position = positionID ? +positionID : 1;
    postRecruitmentAdmission(data)
      .then(() => {
        navigate({ url: ROUTES.frontend.home });
        toast.success(t(KEY.common_creation_successful));
      })
      .catch(() => {
        console.error('Error creating recruitment admission');
        toast.error(t(KEY.common_something_went_wrong));
      });
  }

  if (loading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  if (!positionID || isNaN(Number(positionID))) {
    return (
      <Page>
        <div className={styles.container}>
          <h1>{t(KEY.recruitment_admission)}</h1>
          <p>The position id is invalid, please enter another position id</p>
        </div>
      </Page>
    );
  }

  const submitText = t(KEY.common_send) + ' ' + t(KEY.recruitment_admission);

  return (
    <Page>
      <div className={styles.container}>
        <h1>{dbT(recruitmentPosition, 'name')}</h1>
        <p>{dbT(recruitmentPosition, 'long_description')}</p>
        <SamfForm onSubmit={handleOnSubmit} submitText={submitText} validateOnInit={id !== undefined} devMode={false}>
          <SamfFormField
            field="admission_text"
            type="text-long"
            label={`${t(KEY.common_norwegian)} ${t(KEY.common_name)}`}
          />{' '}
        </SamfForm>
      </div>
    </Page>
  );
}
