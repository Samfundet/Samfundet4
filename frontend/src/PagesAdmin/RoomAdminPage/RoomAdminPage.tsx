import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, CrudButtons, Table } from '~/Components';
import { deleteInterviewRoom, getInterviewRoomsForRecruitment } from '~/api';
import type { InterviewRoomDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { RecruitmentLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';

export function RoomAdminPage() {
  const [interviewRooms, setInterviewRooms] = useState<InterviewRoomDto[] | undefined>();
  const data = useRouteLoaderData('recruitment') as RecruitmentLoader | undefined;
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  useTitle(`${t(KEY.common_room)} ${t(KEY.common_overview)}`);

  useEffect(() => {
    if (data?.recruitment?.id) {
      getInterviewRoomsForRecruitment(data.recruitment.id.toString()).then((response) =>
        setInterviewRooms(response.data),
      );
    }
  }, [data?.recruitment?.id]);

  if (!interviewRooms) {
    return <p>No rooms found</p>;
  }

  const columns = [
    { content: 'Room Name', sortable: true },
    { content: 'Location', sortable: true },
    { content: 'Start Time', sortable: true },
    { content: 'End Time', sortable: true },
    { content: 'Recruitment', sortable: true },
    { content: 'Gang', sortable: true },
    { content: 'Actions', sortable: false },
  ];

  const tableData = interviewRooms.map((room) => ({
    cells: [
      room.name,
      room.location,
      new Date(room.start_time),
      new Date(room.end_time),
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
              deleteInterviewRoom(room.id.toString()).then(() => {
                toast.success('Interview room deleted');
                setInterviewRooms(interviewRooms.filter((r) => r.id !== room.id));
              });
            }}
          />
        ),
      },
    ],
  }));

  return (
    <>
      <Button
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_room_create,
          urlParams: { recruitmentId: data?.recruitment?.id },
        })}
        theme="samf"
      >
        {t(KEY.common_create)}
      </Button>
      <Table columns={columns} data={tableData} defaultSortColumn={0} />
    </>
  );
}
