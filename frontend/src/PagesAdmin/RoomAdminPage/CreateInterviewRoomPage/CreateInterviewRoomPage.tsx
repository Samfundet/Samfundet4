import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import type { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SamfundetLogoSpinner,
} from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getInterviewRoom, postInterviewRoom, putInterviewRoom } from '~/api';
import type { InterviewRoomDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { interviewRoomKeys } from '~/queryKeys';
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

  const { data: interviewRoom, isLoading } = useQuery({
    queryKey: interviewRoomKeys.detail(roomId || ''),
    queryFn: () => (roomId ? getInterviewRoom(roomId as string) : undefined),
    enabled: !!roomId,
  });

  // Set an empty form state for new rooms, or use the existing data for edit mode
  const defaultValues: Partial<InterviewRoomDto> = roomId
    ? {
        name: interviewRoom?.name || '',
        location: interviewRoom?.location || '',
        start_time: utcTimestampToLocal(interviewRoom?.start_time, false) || '',
        end_time: utcTimestampToLocal(interviewRoom?.end_time, false) || '',
      }
    : {
        name: '',
        location: '',
        start_time: '',
        end_time: '',
      };

  const form = useForm<FormType>({
    resolver: zodResolver(roomSchema),
    defaultValues,
    // Reset the form when roomId changes (including when it changes to undefined)
    resetOptions: {
      keepDirtyValues: false,
    },
  });

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
      queryClient.invalidateQueries({ queryKey: interviewRoomKeys.detail(roomId || '') });
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

  // Reset form when roomId changes
  // useEffect(() => {
  //   form.reset(defaultValues);
  // }, [roomId, form, defaultValues]);

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
            <Button type="submit" disabled={isPending}>
              {submitText}
            </Button>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
