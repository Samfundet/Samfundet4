import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getRecruitmentPosition, postRecruitmentAdmission } from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './RecruitmentAdmissionFormPage.module.scss';

export function RecruitmentAdmissionFormPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [loading, setLoading] = useState(true);
  const { positionID } = useParams();

  const { id } = useParams();

  useEffect(() => {
    getRecruitmentPosition('1').then((res) => {
      setRecruitmentPosition(res.data);
      setLoading(false);
    });
  }, []);

  function handleOnSubmit(data: RecruitmentAdmissionDto) {
    data.recruitment_position = positionID ? +positionID : 1;
    postRecruitmentAdmission(data);
    console.log(JSON.stringify(data));
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
