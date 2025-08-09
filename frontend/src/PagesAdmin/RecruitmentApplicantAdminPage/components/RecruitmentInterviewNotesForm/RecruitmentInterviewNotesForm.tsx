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
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<RecruitmentInterviewNotesFormType>({
    resolver: zodResolver(recruitmentNotesSchema),
    defaultValues: {
      notes: initialData.notes || '',
      interviewId: interviewId || 0,
    },
  });

  const watchedNotes = form.watch('notes');

  const updateNotesMutation = useMutation({
    mutationFn: ({ notes, interviewId }: { notes: string; interviewId: number }) =>
      putRecrutmentInterviewNotes(notes, interviewId),
    onSuccess: (data, variables) => {
      // 'variables' contains the { notes, interviewId } passed to mutate
      toast.success(t(KEY.common_update_successful));
      form.reset({ ...form.getValues(), notes: variables.notes });
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [isEditing]);

  // Effect to reset form if initialData changes from props after initial mount
  useEffect(() => {
    // Only reset if the incoming initial notes are different from the current form value
    // and the form isn't currently dirty (to avoid discarding user edits).
    if (initialData.notes !== form.getValues('notes') && !form.formState.isDirty) {
      form.reset({
        notes: initialData.notes || '',
        interviewId: interviewId || 0,
      });
    } else if (interviewId !== form.getValues('interviewId')) {
      form.reset({
        ...form.getValues(),
        interviewId: interviewId || 0,
      });
    }
  }, [initialData.notes, interviewId, form]);

  // Effect to warn user about unsaved changes before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Check if the form has unsaved changes according to react-hook-form
      if (form.formState.isDirty && interviewId) {
        event.preventDefault();
        return t(KEY.common_something_went_wrong);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    // Depend on interviewId and form state (represented by the stable form instance)
  }, [interviewId, form.formState.isDirty, t]);

  function handleEditStart() {
    setIsEditing(true);
  }

  function handleEditEnd() {
    setIsEditing(false);

    // Check if the notes field specifically was modified
    const isNotesDirty = form.formState.dirtyFields.notes;
    const currentNotesValue = form.getValues('notes');

    if (isNotesDirty && interviewId) {
      updateNotesMutation.mutate({ notes: currentNotesValue, interviewId });
    }
  }

  return (
    <Form {...form}>
      <div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.recruitment_interview_notes)}</FormLabel>
              <FormControl>
                <div>
                  {isEditing ? (
                    <Textarea {...field} ref={textareaRef} className={styles.textBox} onBlur={handleEditEnd} />
                  ) : (
                    <MarkdownPreview notes={watchedNotes} onFocus={handleEditStart} />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
