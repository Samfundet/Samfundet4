import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import type { z } from 'zod';
import {
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SamfundetLogoSpinner,
} from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getInterviewRoom, getRecruitmentGangs, postInterviewRoom, putInterviewRoom } from '~/api';
import type { GangDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { interviewRoomKeys, recruitmentGangKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { utcTimestampToLocal } from '~/utils';
import styles from './CreateInterviewRoom.module.scss';
import { roomSchema } from './RoomCreatorSchema';

type FormType = z.infer<typeof roomSchema>;

export function CreateInterviewRoomPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recruitmentId, roomId } = useParams();
  const queryClient = useQueryClient();

  // Parse roomId to number if it exists
  const roomIdNumber = roomId ? Number.parseInt(roomId, 10) : undefined;

  const { data: interviewRoom, isLoading } = useQuery({
    queryKey: interviewRoomKeys.detail(roomIdNumber as number),
    queryFn: () => (roomId ? getInterviewRoom(roomId) : undefined),
    enabled: !!roomId,
  });

  const { data: recruitmentGangs } = useQuery({
    queryKey: recruitmentGangKeys.all,
    queryFn: () => (recruitmentId ? getRecruitmentGangs(recruitmentId as string) : undefined),
    enabled: !!recruitmentId,
  });

  const mapGangs = (gangs: GangDto[]): DropdownOption<number>[] => {
    return gangs.map((gang: GangDto) => ({
      label: gang.name_nb,
      value: gang.id,
    }));
  };

  // Initialize with empty values first
  const form = useForm<FormType>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      location: '',
      start_time: '',
      end_time: '',
      gang: -1,
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (roomId && interviewRoom) {
      form.reset({
        name: interviewRoom.name || '',
        location: interviewRoom.location || '',
        start_time: utcTimestampToLocal(interviewRoom.start_time, false) || '',
        end_time: utcTimestampToLocal(interviewRoom.end_time, false) || '',
        gang: interviewRoom.gang || -1,
      });
    }
  }, [roomId, interviewRoom, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormType & { recruitment: string | undefined }) => postInterviewRoom(data),
    onSuccess: () => {
      // Invalidate relevant queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: interviewRoomKeys.lists() });

      // Reset the form before navigation
      form.reset();

      navigate(
        reverse({
          pattern: ROUTES.frontend.admin_recruitment_room_overview,
          urlParams: { recruitmentId: recruitmentId },
        }),
      );
      toast.success(t(KEY.common_creation_successful));
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; room: FormType & { recruitment: string | undefined } }) =>
      putInterviewRoom(data.id, data.room),
    onSuccess: () => {
      // Invalidate relevant queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: interviewRoomKeys.detail(roomIdNumber as number) });
      queryClient.invalidateQueries({ queryKey: interviewRoomKeys.lists() });

      toast.success(t(KEY.common_update_successful));
      navigate(
        reverse({
          pattern: ROUTES.frontend.admin_recruitment_room_overview,
          urlParams: { recruitmentId: recruitmentId },
        }),
      );
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(error);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const submitText = roomId ? t(KEY.common_save) : t(KEY.common_create);

  if (isLoading && roomId) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function onSubmit(values: FormType) {
    const updatedRoom = {
      ...values,
      recruitment: recruitmentId,
    };

    if (roomId) {
      updateMutation.mutate({ id: roomId, room: updatedRoom });
    } else {
      createMutation.mutate(updatedRoom);
    }
  }

  return (
    <AdminPageLayout title={`${roomId ? t(KEY.common_edit) : t(KEY.common_create)}`} header={true}>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={styles.row}>
              <FormField
                key="name"
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.common_name)}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                key="location"
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.recruitment_interview_location)}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={styles.row}>
              <FormField
                key="start_time"
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.start_time)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                key="end_time"
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.end_time)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                key="gang"
                control={form.control}
                name="gang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.common_gang)}</FormLabel>
                    <FormControl>
                      {recruitmentGangs ? (
                        <Dropdown
                          options={mapGangs(recruitmentGangs)}
                          onChange={(value) => field.onChange(value)}
                          value={field.value}
                        />
                      ) : (
                        <p>{t(KEY.common_loading)}</p>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {submitText}
            </Button>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
