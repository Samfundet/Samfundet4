import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { toast } from 'react-toastify';
import { Button, CrudButtons, Table } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { deleteInterviewRoom, getInterviewRoomsForRecruitment } from '~/api';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { interviewRoomKeys } from '~/queryKeys';
import type { RecruitmentLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';

export function RoomAdminPage() {
  const data = useRouteLoaderData('recruitment') as RecruitmentLoader | undefined;
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  useTitle(`${t(KEY.common_room)} ${t(KEY.common_overview)}`);

  const { data: interviewRooms, isLoading } = useQuery({
    queryKey: interviewRoomKeys.all,
    queryFn: () => (data?.recruitment?.id ? getInterviewRoomsForRecruitment(data?.recruitment?.id) : undefined),
    enabled: !!data?.recruitment?.id,
  });

  // Implement delete mutation
  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => deleteInterviewRoom(roomId),
    onSuccess: () => {
      // Invalidate and refetch the interview room list
      queryClient.invalidateQueries({ queryKey: interviewRoomKeys.all });
      toast.success('Interview room deleted');
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong) || 'Failed to delete interview room');
      console.error('Error deleting interview room:', error);
    },
  });

  if (isLoading) {
    return <p>{t(KEY.common_loading)}</p>;
  }

  const columns = [
    { content: t(KEY.common_name) },
    { content: t(KEY.recruitment_interview_location) },
    { content: t(KEY.start_time) },
    { content: t(KEY.end_time) },
    { content: t(KEY.common_recruitment) },
    { content: t(KEY.common_gang) },
    { content: 'Actions' },
  ];

  const tableData = interviewRooms?.map((room) => ({
    cells: [
      room.name,
      room.location,
      new Date(room.start_time).toLocaleString(),
      new Date(room.end_time).toLocaleString(),
      room.recruitment,
      room.gang !== undefined ? room.gang : 'N/A',
      {
        content: (
          <CrudButtons
            key={`edit-room-${room.id}`}
            onEdit={() =>
              navigate({
                url: reverse({
                  pattern: ROUTES.frontend.admin_recruitment_room_edit,
                  urlParams: { recruitmentId: data?.recruitment?.id, roomId: room.id.toString() },
                }),
              })
            }
            onDelete={() => {
              if (window.confirm('Are you sure you want to delete this room?')) {
                deleteMutation.mutate(room.id.toString());
              }
            }}
          />
        ),
      },
    ],
  }));

  return (
    <>
      <AdminPageLayout
        title={t(KEY.recruitment_applet_room_overview)}
        header={t(KEY.recruitment_applet_room_description)}
      >
        <Button
          link={reverse({
            pattern: ROUTES.frontend.admin_recruitment_room_create,
            urlParams: { recruitmentId: data?.recruitment?.id },
          })}
          theme="samf"
        >
          {t(KEY.common_create)}
        </Button>
        <Table columns={columns} data={tableData} />
      </AdminPageLayout>
    </>
  );
}
