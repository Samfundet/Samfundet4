import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/context/AuthContext';
import { Button, Link, Page, SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import {
  getRecruitmentApplicationsForRecruiter,
  getRecruitmentPosition,
  getRecruitmentPositionsGang,
  putRecruitmentApplication,
  withdrawRecruitmentApplicationApplicant,
} from '~/api';
import { RecruitmentApplicationDto, RecruitmentPositionDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicationFormPage.module.scss';
import { Text } from '~/Components/Text/Text';

type FormProps = {
  application_text: string;
};

export function RecruitmentApplicationFormPage() {
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();
  const standardNavigate = useNavigate();
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [recruitmentPositionsForGang, setRecruitmentPositionsForGang] = useState<RecruitmentPositionDto[]>();

  const [recruitmentApplication, setRecruitmentApplication] = useState<RecruitmentApplicationDto>();

  const [loading, setLoading] = useState(true);

  const { positionID } = useParams();

  useTitle(recruitmentPosition ? dbT(recruitmentPosition, 'name') as string : '');

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
      getRecruitmentApplicationsForRecruiter(positionID as string).then((res) => {
        setRecruitmentApplication(res.data.application);
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

  function withdrawApplication() {
    if (positionID) {
      withdrawRecruitmentApplicationApplicant(positionID)
        .then(() => {
          navigate({
            url: reverse({
              pattern: ROUTES.frontend.recruitment_application_overview,
              urlParams: {
                recruitmentID: recruitmentPosition?.recruitment,
              },
            }),
          });
          toast.success(t(KEY.common_creation_successful));
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }

  function handleOnSubmit(data: FormProps) {
    putRecruitmentApplication(data as Partial<RecruitmentApplicationDto>, positionID ? +positionID : 1)
      .then(() => {
        navigate({
          url: reverse({
            pattern: ROUTES.frontend.recruitment_application_overview,
            urlParams: {
              recruitmentID: recruitmentPosition?.recruitment,
            },
          }),
        });
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
          <h1>{t(KEY.recruitment_application)}</h1>
          <p>The position id is invalid, please enter another position id</p>
        </div>
      </Page>
    );
  }

  const submitText = t(KEY.common_send) + ' ' + t(KEY.recruitment_application);

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
        {recruitmentApplication && (
          <div className={styles.withdrawnContainer}>
            {recruitmentApplication?.withdrawn ? (
              <Text size="l" as="i" className={styles.withdrawnText}>
                {t(KEY.recruitment_withdrawn_message)}
              </Text>
            ) : (
              <Button theme="samf" display="basic" onClick={() => withdrawApplication()}>
                {t(KEY.recruitment_withdraw_application)}
              </Button>
            )}
          </div>
        )}
        {user ? (
          <SamfForm
            initialData={recruitmentApplication as FormProps}
            onSubmit={handleOnSubmit}
            submitText={submitText}
            devMode={false}
          >
            <p className={styles.formLabel}>{t(KEY.recruitment_application)}</p>
            <SamfFormField field="application_text" type="text_long" />{' '}
          </SamfForm>
        ) : (
          <div>
            <Button
              theme="samf"
              onClick={() =>
                navigate({
                  url: ROUTES.frontend.login,
                })
              }
            >
              {t(KEY.common_login)}
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}
