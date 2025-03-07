import { Icon } from '@iconify/react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button, Link, Modal, OccupiedForm, Page } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import {
  getPositionsByTag,
  getRecruitmentApplicationForPosition,
  getRecruitmentPositionForApplicant,
  getRecruitmentPositionsGangForApplicant,
  putRecruitmentApplication,
  withdrawRecruitmentApplicationApplicant,
} from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import type { PositionsByTagResponse, RecruitmentApplicationDto, RecruitmentPositionDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicationFormPage.module.scss';

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
  const [similarPositions, setSimilarPositions] = useState<PositionsByTagResponse>();

  const [recruitmentApplication, setRecruitmentApplication] = useState<RecruitmentApplicationDto>();
  const [openOccupiedForm, setOpenOccupiedForm] = useState(false);
  const [formData, setFormData] = useState<FormProps>();
  const [recruitmentId, setRecruitmentId] = useState(0);
  const [loading, setLoading] = useState(true);

  const { positionId } = useParams();

  useTitle(recruitmentPosition ? (dbT(recruitmentPosition, 'name') as string) : '');

  useEffect(() => {
    Promise.allSettled([
      getRecruitmentPositionForApplicant(positionId as string)
        .then((res) => {
          setRecruitmentPosition(res.data);
          setRecruitmentId(Number.parseInt(res.data.recruitment));
        })
        .catch((error) => {
          if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
            standardNavigate(ROUTES.frontend.not_found, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
      getRecruitmentApplicationForPosition(positionId as string).then((res) => {
        setRecruitmentApplication(res.data);
      }),
    ]).then(() => {
      setLoading(false);
    });
  }, [positionId, standardNavigate, t]);

  useEffect(() => {
    if (!recruitmentPosition?.recruitment || !recruitmentPosition?.gang.id) return;
    getRecruitmentPositionsGangForApplicant(
      recruitmentPosition?.recruitment as string,
      recruitmentPosition?.gang.id,
    ).then((res) => {
      // Filter out the current position from the gang positions
      const filteredPositions = res.data.filter((position) => position.id !== recruitmentPosition?.id);
      setRecruitmentPositionsForGang(filteredPositions);
    });
  }, [recruitmentPosition]);

  useEffect(() => {
    if (!recruitmentPosition) return;
    getPositionsByTag(recruitmentPosition.recruitment, recruitmentPosition.tags, recruitmentPosition.id)
      .then((positions) => {
        setSimilarPositions(positions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recruitmentPosition]);

  function withdrawApplication() {
    if (positionId) {
      withdrawRecruitmentApplicationApplicant(positionId)
        .then(() => {
          navigate({
            url: reverse({
              pattern: ROUTES.frontend.recruitment_application_overview,
              urlParams: {
                recruitmentId: recruitmentPosition?.recruitment,
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
    setFormData(data);
    setOpenOccupiedForm(true);
  }

  function submitData(data: FormProps) {
    putRecruitmentApplication(data as Partial<RecruitmentApplicationDto>, positionId ? +positionId : 1)
      .then(() => {
        navigate({
          url: reverse({
            pattern: ROUTES.frontend.recruitment_application_overview,
            urlParams: {
              recruitmentId: recruitmentPosition?.recruitment,
            },
          }),
        });
        toast.success(t(KEY.common_creation_successful));
      })
      .catch(() => {
        toast.error(t(KEY.common_something_went_wrong));
      });
  }

  if (!positionId || Number.isNaN(Number(positionId))) {
    return (
      <Page loading={loading}>
        <div className={styles.container}>
          <h1>{t(KEY.recruitment_application)}</h1>
          <p>The position id is invalid, please enter another position id</p>
        </div>
      </Page>
    );
  }

  const handlePosNavigate = (pos: RecruitmentPositionDto) => {
    navigate({
      url: reverse({
        pattern: ROUTES.frontend.recruitment_application,
        urlParams: {
          recruitmentId: pos.recruitment,
          positionId: pos.id,
        },
      }),
    });
  };

  const submitText = `${t(KEY.common_send)} ${t(KEY.recruitment_application)}`;

  const otherPositionsAtGang = recruitmentPositionsForGang && recruitmentPositionsForGang.length > 0 && (
    <div className={styles.other_positions}>
      <h2 className={styles.sub_header}>
        {t(KEY.recruitment_otherpositions)} {dbT(recruitmentPosition?.gang, 'name')}
      </h2>
      {recruitmentPositionsForGang?.map((pos) => (
        <Button key={pos.id} display="pill" theme="outlined" onClick={() => handlePosNavigate(pos)}>
          {dbT(pos, 'name')}
        </Button>
      ))}
    </div>
  );

  const similarPositionsBtns = (
    <div className={styles.other_positions}>
      {similarPositions?.positions && (
        <Fragment>
          <h2 className={styles.sub_header}>{t(KEY.recruitment_similar_positions)}</h2>
          {similarPositions.positions.map((similarPosition) => (
            <Button
              key={similarPosition.id}
              display="pill"
              theme="outlined"
              onClick={() => handlePosNavigate(similarPosition)}
            >
              {dbT(similarPosition, 'name')}
            </Button>
          ))}
        </Fragment>
      )}
    </div>
  );

  return (
    <Page loading={loading}>
      <div className={styles.container}>
        {openOccupiedForm && (
          <Modal isOpen={openOccupiedForm} className={styles.occupied_modal}>
            <>
              <button
                type="button"
                className={styles.close_btn}
                title="Close"
                onClick={() => setOpenOccupiedForm(false)}
              >
                <Icon icon="octicon:x-24" width={24} />
              </button>
              <OccupiedForm
                recruitmentId={recruitmentId}
                onCancel={() => setOpenOccupiedForm(false)}
                onConfirm={() => formData && submitData(formData)}
                header="confirm_occupied_time"
                subHeader="confirm_occupied_time_text"
                saveButtonText="confirm_occupied_time_send_application"
              />
            </>
          </Modal>
        )}
        <div className={styles.row}>
          <div className={styles.text_container}>
            <h1 className={styles.header}>{dbT(recruitmentPosition, 'name')}</h1>
            <h2 className={styles.sub_header}>
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
            <h2 className={styles.sub_header}>{t(KEY.recruitment_applyfor)}</h2>
            <p className={styles.text}>{t(KEY.recruitment_applyforhelp)}</p>
          </div>
          {similarPositionsBtns}
          {otherPositionsAtGang}
        </div>
        {recruitmentApplication && (
          <div className={styles.withdrawn_container}>
            {recruitmentApplication?.withdrawn ? (
              <Text size="l" as="i" className={styles.withdrawn_text}>
                {t(KEY.recruitment_withdrawn_message)}:
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
            <h2 className={styles.label}>{t(KEY.recruitment_application)}:</h2>
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
