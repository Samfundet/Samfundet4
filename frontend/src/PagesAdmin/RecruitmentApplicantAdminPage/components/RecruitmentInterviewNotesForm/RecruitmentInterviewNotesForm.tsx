import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea } from '~/Components';
import { KEY } from '~/i18n/constants';

const recruitmentNotesSchema = z.object({
  notes: z.string(),
});

type RecruitmentInterviewNotesFormType = z.infer<typeof recruitmentNotesSchema>;

interface RecruitmentInterviewNotesFormProps {
  initialData: Partial<RecruitmentInterviewNotesFormType>;
}

export function RecruitmentInterviewNotesForm({ initialData }: RecruitmentInterviewNotesFormProps) {
  const { t } = useTranslation();

  const form = useForm<RecruitmentInterviewNotesFormType>({
    resolver: zodResolver(recruitmentNotesSchema),
    defaultValues: initialData,
  });

  function handleUpdateNotes(value: string) {
    // TODO: Update notes using a put request
    console.log(value);
  }

  return (
    <Form {...form}>
      <form>
        <div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(KEY.recruitment_interview_notes)}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    onBlur={(newNotes) => {
                      field.onBlur(); // Call the default onBlur handler from react-hook-form
                      handleUpdateNotes(newNotes.target.value); // Call your custom function on blur
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
