import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea } from '~/Components';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { putRecrutmentInterviewNotes } from '~/api';
import { KEY } from '~/i18n/constants';
import styles from './RecruitmentInterviewNotesForm.module.scss';

type MarkdownPreviewProps = {
  notes: string;
  onFocus: React.MouseEventHandler<HTMLButtonElement>;
};

function MarkdownPreview({ notes, onFocus }: MarkdownPreviewProps) {
  return (
    <div className={styles.markdownWrapper}>
      <button type="button" onClick={onFocus} className={styles.markdownButton}>
        <div className={styles.markdownContent}>
          <SamfMarkdown>{notes}</SamfMarkdown>
        </div>
      </button>
    </div>
  );
}

const recruitmentNotesSchema = z.object({
  notes: z.string(),
  interviewId: z.number(),
});

type RecruitmentInterviewNotesFormType = z.infer<typeof recruitmentNotesSchema>;

interface RecruitmentInterviewNotesFormProps {
  initialData: Partial<RecruitmentInterviewNotesFormType>;
  interviewId?: number;
}

export function RecruitmentInterviewNotesForm({ initialData, interviewId }: RecruitmentInterviewNotesFormProps) {
  const { t } = useTranslation();
  const [currentNotes, setCurrentNotes] = useState(initialData.notes || '');
  const [markdownState, setMarkdownState] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<RecruitmentInterviewNotesFormType>({
    resolver: zodResolver(recruitmentNotesSchema),
    defaultValues: {
      notes: initialData.notes || '',
      interviewId: interviewId || 0,
    },
  });

  const handleUpdateNotes = useMutation({
    mutationFn: ({ notes, interviewId }: { notes: string; interviewId: number }) =>
      putRecrutmentInterviewNotes(notes, interviewId),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  useEffect(() => {
    if (markdownState && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      // Set cursor position to end of text
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [markdownState]);

  function handleFocus() {
    setMarkdownState(true);
  }

  const handleNotesChange = (newNotes: string) => {
    if (newNotes !== currentNotes && interviewId) {
      setCurrentNotes(newNotes);
      handleUpdateNotes.mutate({ notes: newNotes, interviewId });
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.stopImmediatePropagation();
      if (interviewId) {
        // Ensure data is saved before leaving (e.g. on refresh)
        putRecrutmentInterviewNotes(currentNotes, interviewId);
        // preventDefault() triggers the confirmation box.
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentNotes, interviewId]);

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
                  <div>
                    {markdownState ? (
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        className={styles.textBox}
                        onBlur={() => {
                          field.onBlur();
                          handleNotesChange(form.getValues('notes'));
                          setMarkdownState(false);
                        }}
                      />
                    ) : (
                      <MarkdownPreview notes={currentNotes} onFocus={handleFocus} />
                    )}
                  </div>
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
