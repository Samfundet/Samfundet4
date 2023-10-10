import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reverse } from '~/named-urls';
import { Page, SamfundetLogoSpinner, Link } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getRecruitmentPosition, postRecruitmentAdmission } from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentAdmissionFormPage.module.scss';

export function RecruitmentAdmissionFormPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [loading, setLoading] = useState(true);
  const { positionID, id } = useParams();

  useEffect(() => {
    getRecruitmentPosition('1').then((res) => {
      setRecruitmentPosition(res.data);
      setLoading(false);
    });
  }, []);

  function handleOnSubmit(data: RecruitmentAdmissionDto) {
    data.recruitment_position = positionID ? +positionID : 1;
    postRecruitmentAdmission(data)
      .then(() => {
        navigate(ROUTES.frontend.home);
        toast.success(t(KEY.common_creation_successful));
      })
      .catch(() => {
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
        
        <h1 className={styles.header}>{dbT(recruitmentPosition, 'name')}</h1>
        <h2 className={styles.subheader}>
          {t(KEY.recruitment_volunteerfor)}{' '}
          <i>
            {recruitmentPosition?.is_funksjonaer_position
              ? t(KEY.recruitment_funksjonaer)
              : t(KEY.recruitment_gangmember)}
          </i>{' '}
          <Link
            url={reverse({
              pattern: ROUTES.frontend.information_page_detail,
              urlParams: { slugField: recruitmentPosition?.gang.name_nb.toLowerCase() },
            })}
          >
            {dbT(recruitmentPosition?.gang, 'name')}
          </Link>
        </h2>
        <p className={styles.text}>{dbT(recruitmentPosition, 'long_description')}</p>
        <h2 className={styles.subheader}>{t(KEY.recruitment_applyfor)}</h2>
        <p className={styles.text}>{t(KEY.recruitment_applyforhelp)}</p>
        <SamfForm onSubmit={handleOnSubmit} submitText={submitText} validateOnInit={id !== undefined} devMode={false}>
          <p className={styles.formLabel}>{t(KEY.recruitment_admission)}</p>
          <SamfFormField field="admission_text" type="text-long" />{' '}
        </SamfForm>
      </div>
    </Page>
  );
}
