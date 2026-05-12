import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dropdown,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Modal,
  Text,
} from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';
import type { EventStatusOption } from '../types';

type Props = {
  form: UseFormReturn<FormType>;
  eventStatusOptions: EventStatusOption[];
};

export function SummaryStep({ form, eventStatusOptions }: Props) {
  const { t } = useTranslation();
  const [isStatusInfoOpen, setIsStatusInfoOpen] = useState(false);

  return (
    <>
      <div className={styles.input_row}>
        <FormField
          control={form.control}
          name="visibility_from_dt"
          key="visibility_from_dt"
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.saksdokumentpage_publication_date) ?? ''}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          key="status"
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <div className={styles.status_label_row}>
                <FormLabel>{t(KEY.event_status)}</FormLabel>
                <button
                  type="button"
                  className={styles.status_info_button}
                  onClick={() => setIsStatusInfoOpen(true)}
                  title={t(KEY.common_more_info)}
                  aria-label={t(KEY.event_status_help_button_aria_label)}
                >
                  <Icon icon="material-symbols:info-outline-rounded" width={18} height={18} />
                </button>
              </div>
              <FormControl>
                <Dropdown options={eventStatusOptions} nullOption={{ label: t(KEY.common_choose) }} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Modal
        isOpen={isStatusInfoOpen}
        onRequestClose={() => setIsStatusInfoOpen(false)}
        className={styles.status_help_modal}
      >
        <div className={styles.status_help_modal_header}>
          <Text as="strong" size="l">
            {t(KEY.event_status_help_title)}
          </Text>
          <button
            type="button"
            className={styles.status_help_close_button}
            onClick={() => setIsStatusInfoOpen(false)}
            aria-label={t(KEY.common_close)}
          >
            <Icon icon="material-symbols:close-rounded" width={20} height={20} />
          </button>
        </div>

        <Text className={styles.status_help_intro}>{t(KEY.event_status_help_intro)}</Text>

        <ul className={styles.status_help_list}>
          {eventStatusOptions.map((option) => (
            <li key={option.value}>
              <strong>{option.label}:</strong> {option.description}
            </li>
          ))}
        </ul>

        <div className={styles.status_help_actions}>
          <Button theme="blue" rounded={true} onClick={() => setIsStatusInfoOpen(false)}>
            {t(KEY.common_close)}
          </Button>
        </div>
      </Modal>
    </>
  );
}
