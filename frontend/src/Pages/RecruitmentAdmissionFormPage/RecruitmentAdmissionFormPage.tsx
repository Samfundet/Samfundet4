import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/AuthContext';
import { Button, Image, Link, Page, SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import {
  getRecruitmentAdmissionForApplicant,
  getRecruitmentPosition,
  getRecruitmentPositionsGang,
  putRecruitmentAdmission,
} from '~/api';
import { RecruitmentAdmissionDto, RecruitmentPositionDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentAdmissionFormPage.module.scss';

export function RecruitmentAdmissionFormPage() {
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();
  const standardNavigate = useNavigate();
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [recruitmentPositionsForGang, setRecruitmentPositionsForGang] = useState<RecruitmentPositionDto[]>();

  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto>();

  const [loading, setLoading] = useState(true);

  const { positionID } = useParams();

  useEffect(() => {
    Promise.allSettled([
      getRecruitmentPosition(positionID as string)
        .then((res) => {
          setRecruitmentPosition(res.data);
        })
        .catch((error) => {
          if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
            standardNavigate(ROUTES.frontend.not_found);
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
      getRecruitmentAdmissionForApplicant(positionID as string).then((res) => {
        setRecruitmentAdmission(res.data);
      }),
    ]).then(() => {
      setLoading(false);
    });
  }, [positionID, standardNavigate, t]);

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
            <div className={styles.rowHeader}>
              <div>
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
              </div>

              {recruitmentPosition && (
                <div className={styles.imageContainer}>
                  <Image src={recruitmentPosition.organization.logo} className={styles.image} />
                </div>
              )}
            </div>
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
