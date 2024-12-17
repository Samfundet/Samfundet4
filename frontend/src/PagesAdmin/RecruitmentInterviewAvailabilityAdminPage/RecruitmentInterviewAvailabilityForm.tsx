import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addDays, addMinutes, format, parse } from 'date-fns';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Button,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  H3,
  Input,
  MiniCalendar,
  NumberInput,
  TimeslotSelector,
} from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import { postRecruitmentAvailability } from '~/api';
import type { RecruitmentAvailabilityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import {
  AVAILABILITY_TIMESLOT_INTERVAL,
  AVAILABILITY_TIMESLOT_INTERVAL_MAX,
  AVAILABILITY_TIMESLOT_INTERVAL_MIN,
  AVAILABILITY_TIMESLOT_TIME,
} from '~/schema/recruitment';
import styles from './RecruitmentInterviewAvailabilityForm.module.scss';

type Props = {
  recruitmentId: number;
  data?: RecruitmentAvailabilityDto;
};

const schema = z
  .object({
    start_date: z.date(),
    end_date: z.date(),
    start_time: AVAILABILITY_TIMESLOT_TIME,
    end_time: AVAILABILITY_TIMESLOT_TIME,
    timeslot_interval: AVAILABILITY_TIMESLOT_INTERVAL,
  })
  .refine((data) => data.end_date > data.start_date, {
    message: i18next.t(KEY.interview_availability_error_end_date_before_start_date),
    path: ['end_date'],
  });

type SchemaType = z.infer<typeof schema>;

export function RecruitmentInterviewAvailabilityForm({ recruitmentId, data }: Props) {
  const defaultStartDate = data?.start_date ? new Date(data.start_date) : undefined;
  const defaultEndDate = data?.end_date ? new Date(data.end_date) : undefined;

  const [fromDate, setFromDate] = useState<Date | undefined>(defaultStartDate);
  const [toDate, setToDate] = useState<Date | undefined>(defaultEndDate);

  const [timeslots, setTimeslots] = useState<string[]>([]);

  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ recruitmentId, data }: { recruitmentId: number; data: Partial<RecruitmentAvailabilityDto> }) =>
      postRecruitmentAvailability(recruitmentId, data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
  });

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: defaultStartDate,
      end_date: defaultEndDate,
      start_time: data?.start_time || '',
      end_time: data?.end_time || '',
      timeslot_interval: data?.timeslot_interval || 30,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    updateTimeslotPreview();
  }, [data]);

  function onSubmit(values: SchemaType) {
    mutate({
      recruitmentId,
      data: {
        start_date: format(values.start_date, 'yyyy-LL-dd'),
        end_date: format(values.end_date, 'yyyy-LL-dd'),
        start_time: values.start_time,
        end_time: values.end_time,
        timeslot_interval: values.timeslot_interval,
      },
    });
  }

  function updateTimeslotPreview() {
    const data = form.getValues();
    if (!data.start_time || !data.end_time) {
      return [];
    }

    const startTime = parse(data.start_time, 'HH:mm', new Date());
    let endTime = parse(data.end_time, 'HH:mm', new Date());
    if (!startTime || !endTime) {
      return [];
    }

    // If end time is before start, it likely means we want to pass midnight. So add another day
    if (endTime < startTime) {
      endTime = addDays(endTime, 1);
    }

    const diff = (endTime.getTime() - startTime.getTime()) / 1000;

    const interval = data.timeslot_interval;
    const intervalCount = Math.floor(diff / (interval * 60));

    const x = [];
    for (let i = 0; i < intervalCount; i++) {
      x.push(format(addMinutes(startTime, i * interval), 'HH:mm'));
    }
    setTimeslots(x);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <div className={styles.form_grid}>
            <FormField
              control={form.control}
              name="start_date"
              disabled={isPending}
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.start_date)}</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={(d) => {
                        setFromDate(d || undefined);
                        onChange(d);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              disabled={isPending}
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.end_date)}</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={(d) => {
                        setToDate(d || undefined);
                        onChange(d);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_time"
              disabled={isPending}
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.start_time)}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="HH:MM"
                      maxLength={5}
                      onChange={(e) => {
                        onChange(e);
                        updateTimeslotPreview();
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_time"
              disabled={isPending}
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.end_time)}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="HH:MM"
                      maxLength={5}
                      onChange={(e) => {
                        onChange(e);
                        updateTimeslotPreview();
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeslot_interval"
              disabled={isPending}
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.common_interval)}</FormLabel>
                  <FormDescription>{t(KEY.interview_availability_interval_description)}</FormDescription>
                  <FormControl>
                    <NumberInput
                      min={AVAILABILITY_TIMESLOT_INTERVAL_MIN}
                      max={AVAILABILITY_TIMESLOT_INTERVAL_MAX}
                      className={styles.interval_input}
                      onChange={(e) => {
                        onChange(e);
                        updateTimeslotPreview();
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <H3>{t(KEY.common_preview)}</H3>
            <div className={styles.preview}>
              <MiniCalendar minDate={fromDate} maxDate={toDate} baseDate={fromDate || new Date()} displayLabel={true} />
              {timeslots && (
                <TimeslotSelector
                  selectedDate={new Date()}
                  timeslots={timeslots}
                  label={t(KEY.available_timeslots)}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.action_row}>
          <Button type="submit" theme="green" disabled={isPending} rounded>
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
