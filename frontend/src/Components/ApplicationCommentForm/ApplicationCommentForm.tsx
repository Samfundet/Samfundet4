import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '~/Components';

type CommentFormProps = {
  commentText?: string;
  handlePost: () => void;
};

export function ApplicationCommentForm({ commentText, handlePost }: CommentFormProps) {
  const [comment, setComment] = useState(commentText || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevCommentRef = useRef(comment);

  // Update state if initialData changes
  useEffect(() => {
    setComment(commentText || '');
  }, [commentText]);

  // Handle blur event
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    // TODO: implement actuall comment logic
    const newValue = event.target.value;

    // Only update if the value has changed
    if (newValue !== prevCommentRef.current) {
      // Update the ref to the current value
      prevCommentRef.current = newValue;

      // Update state
      setComment(newValue);

      handlePost();
    }
  };

  return (
    <div>
      <Textarea ref={textareaRef} value={comment} onChange={(e) => setComment(e.target.value)} onBlur={handleBlur} />
    </div>
  );
}
