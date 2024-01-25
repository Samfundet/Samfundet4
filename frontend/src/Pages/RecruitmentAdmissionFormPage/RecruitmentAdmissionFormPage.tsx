import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reverse } from '~/named-urls';
import { Page, SamfundetLogoSpinner, Link, Button } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import {
  getRecruitmentPosition,
  getRecruitmentAdmissionForApplicant,
  putRecruitmentAdmission,
  getRecruitmentPositionsGang,
} from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentAdmissionFormPage.module.scss';
import { useAuthContext } from '~/AuthContext';

export function RecruitmentAdmissionFormPage() {
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [recruitmentPositionsForGang, setRecruitmentPositionsForGang] = useState<RecruitmentPositionDto[]>();

  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto>();

  const [loading, setLoading] = useState(true);

  const { positionID } = useParams();

  useEffect(() => {
    Promise.allSettled([
      getRecruitmentPosition(positionID as string).then((res) => {
        setRecruitmentPosition(res.data);
      }),
      getRecruitmentAdmissionForApplicant(positionID as string).then((res) => {
        setRecruitmentAdmission(res.data);
      }),
    ]).then(() => {
      setLoading(false);
    });
  }, [positionID]);

  useEffect(() => {
    getRecruitmentPositionsGang(recruitmentPosition?.recruitment as string, recruitmentPosition?.gang.id).then(
      (res) => {
        setRecruitmentPositionsForGang(res.data);
      },
    );
  }, [recruitmentPosition]);

  function handleOnSubmit(data: RecruitmentAdmissionDto) {
    putRecruitmentAdmission(data, positionID ? +positionID : 1)
      .then(() => {
        navigate({ url: ROUTES.frontend.home });
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
        <div className={styles.row}>
          <div className={styles.textcontainer}>
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
          </div>

          <div className={styles.otherpositions}>
            <h2 className={styles.subheader}>
              {t(KEY.recruitment_otherpositions)} {dbT(recruitmentPosition?.gang, 'name')}
            </h2>
            {recruitmentPositionsForGang?.map((pos, index) => {
              if (pos.id !== recruitmentPosition?.id) {
                return (
                  <Button
                    key={index}
                    display="pill"
                    theme="outlined"
                    onClick={() => {
                      navigate({
                        url: reverse({
                          pattern: ROUTES.frontend.recruitment_application,
                          urlParams: { positionID: pos.id, gangID: pos.gang.id },
                        }),
                      });
                    }}
                  >
                    {dbT(pos, 'name')}
                  </Button>
                );
              }
            })}
          </div>
        </div>
        {user ? (
          <SamfForm
            initialData={{ admission_text: recruitmentAdmission?.admission_text }}
            onSubmit={handleOnSubmit}
            submitText={submitText}
            validateOnInit={true}
            devMode={false}
          >
            <p className={styles.formLabel}>{t(KEY.recruitment_admission)}</p>
            <SamfFormField field="admission_text" type="text-long" />{' '}
          </SamfForm>
        ) : (
          <div>TODO add login redirect</div>
        )}
      </div>
    </Page>
  );
}
