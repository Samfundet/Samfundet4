import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { Button, Form, FormField, FormItem, FormLabel, Input, Textarea } from "~/Components";
import { FormControl, FormMessage } from "~/Components/Forms/Form";
import { useTitle } from "~/hooks";
import { KEY } from "~/i18n/constants";
import { NON_EMPTY_STRING } from '~/schema/strings';
import { lowerCapitalize } from "~/utils";
import { AdminPageLayout } from "../AdminPageLayout/AdminPageLayout";
import styles from './RecruitmentRejectionMailPage.module.scss';


export function RecruitmentRejectionMailPage() {
  const { t } = useTranslation();
  const title = lowerCapitalize(t(KEY.recruitment_rejection_email));
  useTitle(title);

  const recjectionMailSchema = z.object({
    subject: NON_EMPTY_STRING,
    textBeforeName: NON_EMPTY_STRING,
    content: NON_EMPTY_STRING,
  });

  const form = useForm<z.infer<typeof recjectionMailSchema>>({
    resolver: zodResolver(recjectionMailSchema),
    defaultValues: {
      subject: '',
      textBeforeName: '',
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof recjectionMailSchema>) {
    // ISSUE #1727 - TODO:
    // Connect backend rejection mail "SendRejectionMailView" and create a page with overview of the recipients
  }

  return (
    <AdminPageLayout title={lowerCapitalize(t(KEY.recruitment_rejection_email))}>
      <div className={styles.flex_row}>
        <div className={styles.flex_item}>
          <h2 className={styles.subheader}>{t(KEY.common_create)} {(t(KEY.common_email)).toLowerCase()}</h2>
          <hr />
        </div>
        <div className={styles.flex_item}>
          <h2 className={styles.subheader}>{t(KEY.recruitment_preview)}</h2>
          <hr />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.flex_row}>
            <div className={styles.flex_item}>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t(KEY.common_email_subject)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="textBeforeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t(KEY.recruitment_text_before_name)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t(KEY.common_content)}`}</FormLabel>
                    <FormControl>
                      <Textarea className={styles.textarea} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={classNames(styles.flex_item, styles.preview)}>
              <p className={styles.subject}>{form.watch("subject")}</p>
              <p className={styles.textBeforeName}>{form.watch("textBeforeName")} {`<${t(KEY.common_firstname)}>`},</p>
              <pre className={styles.content}>{form.watch("content")}</pre>
            </div>
          </div>
          <div className={styles.flex_row}>
            <div className={styles.flex_item}>
              <Button type="submit">{t(KEY.recruitment_look_at_recipients)}</Button>
            </div>
          </div>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
