import { useMutation } from '@tanstack/react-query';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Textarea } from '~/Components';
import { addApplicationComment } from '~/api';
import { KEY } from '~/i18n/constants';

type CommentFormProps = {
  applicationId: number;
  commentText?: string;
  onSuccess: () => void;
};

export function ApplicationCommentForm({ applicationId, commentText, onSuccess }: CommentFormProps) {
  const [comment, setComment] = useState(commentText || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevCommentRef = useRef(comment);
  const { t } = useTranslation();

  const { mutate: postComment } = useMutation({
    mutationFn: (newComment: string) => addApplicationComment(applicationId, newComment),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
      onSuccess();
    },
    onError: () => {
      toast.error(t(KEY.error_generic));
    },
  });

  useEffect(() => {
    const newCommentText = commentText || '';
    setComment(newCommentText);
    prevCommentRef.current = newCommentText;
  }, [commentText]);

  function handleBlur(event: React.FocusEvent<HTMLTextAreaElement>) {
    const newValue = event.target.value;

    if (newValue !== prevCommentRef.current) {
      prevCommentRef.current = newValue;

      setComment(newValue);

      postComment(newValue);
    }
  }

  return (
    <div>
      <Textarea ref={textareaRef} value={comment} onChange={(e) => setComment(e.target.value)} onBlur={handleBlur} />
    </div>
  );
}
