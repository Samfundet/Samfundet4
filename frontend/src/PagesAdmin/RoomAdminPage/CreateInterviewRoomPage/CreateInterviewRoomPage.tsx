import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getInterviewRoom, postInterviewRoom, putInterviewRoom } from '~/api';
import type { InterviewRoomDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

type FormType = {
  name: string;
  location: string;
  start_time: string;
  end_time: string;
};

export function CreateInterviewRoomPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { recruitmentId, roomId } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [room, setRoom] = useState<Partial<InterviewRoomDto>>();

  useEffect(() => {
    if (roomId) {
      getInterviewRoom(roomId)
        .then((data) => {
          setRoom(data.data);
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(
              reverse({
                pattern: ROUTES.frontend.admin_recruitment_room_overview,
                urlParams: { recruitmentId: recruitmentId },
              }),
              { replace: true },
            );
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [roomId, recruitmentId, navigate, t]);

  const initialData: Partial<InterviewRoomDto> = {
    name: room?.name,
    location: room?.location,
    start_time: room?.start_time,
    end_time: room?.end_time,
  };

  const submitText = roomId ? t(KEY.common_save) : t(KEY.common_create);

  if (showSpinner) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: InterviewRoomDto) {
    const updatedRoom = {
      ...data,
      recruitment: recruitmentId,
    };

    if (roomId) {
      putInterviewRoom(roomId, updatedRoom)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_room_overview,
              urlParams: { recruitmentId: recruitmentId },
            }),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    } else {
      postInterviewRoom(updatedRoom)
        .then(() => {
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_room_overview,
              urlParams: { recruitmentId: recruitmentId },
            }),
          );
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }

  return (
    <AdminPageLayout title={`${roomId ? t(KEY.common_edit) : t(KEY.common_create)}`} header={true}>
      <div>
        <SamfForm<FormType> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
          <div>
            <SamfFormField<string, FormType> field="name" type="text" label={t(KEY.common_name)} required={true} />
          </div>
          <div>
            <SamfFormField<string, FormType>
              field="location"
              type="text"
              label={t(KEY.recruitment_interview_location)}
              required={true}
            />
          </div>
          <div>
            <SamfFormField<string, FormType>
              field="start_time"
              type="date_time"
              label={t(KEY.start_time)}
              required={true}
            />
          </div>
          <div>
            <SamfFormField<string, FormType>
              field="end_time"
              type="date_time"
              label={t(KEY.end_time)}
              required={true}
            />
          </div>
        </SamfForm>
      </div>
    </AdminPageLayout>
  );
}
