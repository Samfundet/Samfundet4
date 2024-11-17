import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { addDays, addMinutes, format, parse } from 'date-fns';
import i18next from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  TimeslotContainer,
} from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import type { RecruitmentInterviewAvailabilityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import {
  AVAILABILITY_TIMESLOT_INTERVAL,
  AVAILABILITY_TIMESLOT_INTERVAL_MAX,
  AVAILABILITY_TIMESLOT_INTERVAL_MIN,
  AVAILABILITY_TIMESLOT_TIME,
} from '~/schema/recruitment';
import styles from './RecruitmentInterviewAvailabilityForm.module.scss';

type Props = {
  data?: RecruitmentInterviewAvailabilityDto;
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

export function RecruitmentInterviewAvailabilityForm({ data }: Props) {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const [timeslots, setTimeslots] = useState<string[]>([]);

  const { t } = useTranslation();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: data?.start_date ? new Date(data.start_date) : undefined,
      end_date: data?.end_date ? new Date(data.end_date) : undefined,
      start_time: data?.start_time,
      end_time: data?.end_time,
      timeslot_interval: data?.timeslot_interval || 30,
    },
  });

  function onSubmit(values: SchemaType) {
    console.log('Values:', values);
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
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.start_time)}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="HH:MM"
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
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t(KEY.end_time)}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="HH:MM"
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
                <TimeslotContainer
                  selectedDate={new Date()}
                  timeslots={timeslots}
                  selectMultiple={false}
                  hasDisabledTimeslots={false}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.action_row}>
          <Button type="submit" theme="green" rounded>
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
