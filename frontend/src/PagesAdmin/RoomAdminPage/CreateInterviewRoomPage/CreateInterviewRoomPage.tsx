import { useRouteLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { postInterviewRoom } from '~/api';
import type { InterviewRoomDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import type { RecruitmentLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';

export function CreateInterviewRoomPage() {
  const data = useRouteLoaderData('recruitment') as RecruitmentLoader | undefined;
  const navigation = useCustomNavigate();
  if (!data?.recruitment?.id) {
    return <p>No recruitment id found</p>;
  }

  const initialData: Partial<InterviewRoomDto> = {
    recruitment: Number(data.recruitment.id),
  };
  // ROUTES.frontend.admin_recruitment_room_overview, { recruitmentId: data.recruitment }
  function handleSubmit(data: InterviewRoomDto) {
    try {
      postInterviewRoom(data).then(() => {
        toast.success('Interview room created');
        navigation({ url: ROUTES.frontend.admin_recruitment_room_overview });
      });
    } catch (error) {
      toast.error('Failed to create interview room');
    }
  }

  return (
    <SamfForm<InterviewRoomDto> initialData={initialData} onSubmit={handleSubmit}>
      <SamfFormField type="text" field={'name'} />
      <SamfFormField type="text" field={'location'} />
      <SamfFormField type="date_time" field={'start_time'} />
      <SamfFormField type="date_time" field={'end_time'} />
    </SamfForm>
  );
}
