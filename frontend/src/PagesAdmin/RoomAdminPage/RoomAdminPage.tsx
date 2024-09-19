import { useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { Table } from '~/Components';
import { getInterviewRoomsForRecruitment } from '~/api';
import type { InterviewRoomDto } from '~/dto';
import type { RecruitmentLoader } from '~/router/loaders';

export function RoomAdminPage() {
  const [interviewRooms, setInterviewRooms] = useState<InterviewRoomDto[] | undefined>();
  const data = useRouteLoaderData('recruitment') as RecruitmentLoader | undefined;

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
  ];

  const tableData = interviewRooms.map((room) => [
    room.name,
    room.location,
    new Date(room.start_time),
    new Date(room.end_time),
    room.recruitment,
    room.gang !== undefined ? room.gang : 'N/A',
  ]);

  return <Table columns={columns} data={tableData} defaultSortColumn={0} />;
}
