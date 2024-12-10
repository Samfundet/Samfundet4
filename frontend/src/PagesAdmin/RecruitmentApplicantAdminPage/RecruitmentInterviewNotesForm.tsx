import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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
  const [currentNotes, setCurrentNotes] = useState(initialData.notes || '');
  const form = useForm<RecruitmentInterviewNotesFormType>({
    resolver: zodResolver(recruitmentNotesSchema),
    defaultValues: initialData,
  });



  async function handleUpdateNotes(value: string) {
    try {
      // TODO: Update notes using a put request
      console.log("Updating notes");
      // Simulate a successful PUT request. TODO: Replace with successful PUT request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notes updated successfully!");
    } catch (error) {
      toast.error("Failed to update notes.");
    }
  }

  const handleNotesChange = (newNotes: string) => {
    if (newNotes !== currentNotes) {
      setCurrentNotes(newNotes);
      handleUpdateNotes(newNotes);
    }
  };



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
                      handleNotesChange(newNotes.target.value); // Call your custom function on blur
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
