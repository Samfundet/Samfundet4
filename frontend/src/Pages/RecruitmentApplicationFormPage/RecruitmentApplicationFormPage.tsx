import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getRecruitmentPosition } from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicationFormPage.module.scss';

export function RecruitmentApplicationFormPage() {
  const { t } = useTranslation();
  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [admission, setAdmission] = useState<Partial<RecruitmentAdmissionDto>>({
    recruitment_position: id ? +id : undefined,
  });

  useEffect(() => {
    getRecruitmentPosition('1').then((res) => {
      setRecruitmentPosition(res.data);
      console.log(res.data);
      setLoading(false);
    });
  }, []);

  function handleOnSubmit(data: RecruitmentAdmissionDto) {
    console.log(JSON.stringify(data));
  }

  if (loading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  console.log(id);

  const submitText = t(KEY.common_send) + ' ' + t(KEY.recruitment_admission);

  return (
    <Page>
      <div className={styles.container}>
        <h1>{dbT(recruitmentPosition, 'name')}</h1>
        <p>{dbT(recruitmentPosition, 'long_description')}</p>
        <SamfForm initialData={admission} submitText={submitText} onSubmit={handleOnSubmit}>
          <SamfFormField field="admission_text" type="text-long" label={`${t(KEY.recruitment_admission)}`} />
        </SamfForm>
      </div>
    </Page>
  );
}
