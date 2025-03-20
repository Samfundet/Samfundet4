import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  InputFile,
  Link,
  Modal,
  OccupiedForm,
  Page,
  Textarea,
  ToolTip,
} from '~/Components';
import { Text } from '~/Components/Text/Text';
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
import { useCustomNavigate, useMobile, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicationFormPage.module.scss';

type FormProps = {
  application_text: string;
  video_url?: string;
  image_attachment?: File;
};

const recruitmentApplicationSchema = z.object({
  application_text: z.string(),
  video_url: z.string(),
  image_attachment: z.instanceof(File).optional(),
});

type RecruitmentApplicationFormType = z.infer<typeof recruitmentApplicationSchema>;

export function RecruitmentApplicationFormPage() {
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();
  const standardNavigate = useNavigate();
  const { t } = useTranslation();

  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [recruitmentPositionsForGang, setRecruitmentPositionsForGang] = useState<RecruitmentPositionDto[]>();
  const [similarPositions, setSimilarPositions] = useState<PositionsByTagResponse>();

  const [recruitmentApplication, setRecruitmentApplication] = useState<RecruitmentApplicationDto>();
  const [imageAttachment, setImageAttachment] = useState<File>();
  const [openOccupiedForm, setOpenOccupiedForm] = useState(false);
  const [formData, setFormData] = useState<FormProps>();
  const [recruitmentId, setRecruitmentId] = useState(0);
  const [loading, setLoading] = useState(true);

  const { positionId } = useParams();
  const isMobile = useMobile();

  const form = useForm<RecruitmentApplicationFormType>({
    resolver: zodResolver(recruitmentApplicationSchema),
  });

  useTitle(recruitmentPosition ? (dbT(recruitmentPosition, 'name') as string) : '');

  useEffect(() => {
    if (recruitmentApplication?.application_text) {
      form.setValue('application_text', recruitmentApplication.application_text);
    }
    if (recruitmentApplication?.image) form.setValue("image_attachment", recruitmentApplication.image);
    if (recruitmentApplication?.video_url) form.setValue("video_url", recruitmentApplication.video_url);

  }, [recruitmentApplication, form, imageAttachment]);

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

  const submitData = useMutation({
    mutationFn: ({ data, positionId }: { data: Partial<RecruitmentApplicationDto>; positionId: number }) => {
      return putRecruitmentApplication(data, positionId);
    },
    onSuccess: () => {
      navigate({
        url: reverse({
          pattern: ROUTES.frontend.recruitment_application_overview,
          urlParams: {
            recruitmentId: recruitmentPosition?.recruitment,
          },
        }),
      });
      toast.success(t(KEY.common_creation_successful));
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

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
      <div className={styles.other_positions_buttons}>
        {recruitmentPositionsForGang?.map((pos) => (
          <Button key={pos.id} display="pill" theme="outlined" onClick={() => handlePosNavigate(pos)}>
            {dbT(pos, 'name')}
          </Button>
        ))}
      </div>
    </div>
  );

  const similarPositionsBtns = (
    <div className={styles.other_positions}>
      {similarPositions?.positions && (
        <>
          <h2 className={styles.sub_header}>{t(KEY.recruitment_similar_positions)}</h2>
          <div className={styles.other_positions_buttons}>
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
          </div>
        </>
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
                onConfirm={() =>
                  formData && submitData.mutate({ data: formData, positionId: positionId ? +positionId : 1 })
                }
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
          </div>
          {!isMobile && (
            <div className={styles.other_positions}>
              {similarPositionsBtns}
              {otherPositionsAtGang}
            </div>
          )}
        </div>
        {recruitmentApplication?.withdrawn && (
          <div className={styles.withdrawn_container}>
            <Text size="l" as="i" className={styles.withdrawn_text}>
              {t(KEY.recruitment_withdrawn_message)}
            </Text>
          </div>
        )}
        {user ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)}>
                <div className={styles.form_header}>
                  <h2 className={styles.label}>{t(KEY.recruitment_application)}</h2>
                  <ToolTip value={t(KEY.recruitment_applyforhelp)}>
                    <Icon icon="mingcute:question-fill" width="1.2em" height="1.2em" />
                  </ToolTip>
                </div>
                <FormField
                  control={form.control}
                  name="application_text"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value} // Ensure the Textarea is controlled
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                {!recruitmentPosition?.allow_video_url && (
                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field}
                              value={field.value}
                              className={styles.video_url_textarea}
                              placeholder='Youtube/video link:'
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                )}
                <div className={styles.button_container}>
                  {!recruitmentPosition?.allow_image_attachment && (
                    <FormField
                      control={form.control}
                      name="image_attachment"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <InputFile
                                fileType="image"
                                onSelected={(file) => field.onChange(file)}
                              />
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />

                  )}
                  <div className={styles.form_buttons}>
                    <Button type="submit" theme="green" display="basic">
                      {submitText}
                    </Button>
                    {!recruitmentApplication?.withdrawn && recruitmentApplication && (
                      <Button type="button" theme="samf" display="basic" onClick={() => withdrawApplication()}>
                        {t(KEY.recruitment_withdraw_application)}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </>
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

        {isMobile && (
          <>
            {similarPositionsBtns}
            {otherPositionsAtGang}
          </>
        )}
      </div>
    </Page>
  );
}
