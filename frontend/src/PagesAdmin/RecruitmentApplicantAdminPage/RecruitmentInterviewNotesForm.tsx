import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea } from "~/Components";
import { KEY } from "~/i18n/constants";
import { useTranslation } from "react-i18next";

const recruitmentNotesSchema = z.object({
  notes: z.string(),
});

  
type RecruitmentInterviewNotesFormType = z.infer<typeof recruitmentNotesSchema>;


interface RecruitmentInterviewNotesFormProps {
  initialData: Partial<RecruitmentInterviewNotesFormType>;
}


export function RecruitmentInterviewNotesForm ({initialData }: RecruitmentInterviewNotesFormProps) {

  const { t } = useTranslation();

  const form = useForm<RecruitmentInterviewNotesFormType>({
    resolver: zodResolver(recruitmentNotesSchema),
    defaultValues: initialData,
  });

  function handleUpdateNotes(value: string) {
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
                <FormLabel>{`${t(KEY.common_long_description)} ${t(KEY.common_english)}`}</FormLabel>
                <FormControl>
                <Textarea {...field} 
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
  )
}
