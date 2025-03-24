import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '~/Components';

type CommentFormProps = {
  initialData: string;
  handlePost: () => void;
};

export function ApplicationCommentForm({ initialData, handlePost }: CommentFormProps) {
  const [comment, setComment] = useState(initialData || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevCommentRef = useRef(comment);

  // Update state if initialData changes
  useEffect(() => {
    setComment(initialData || '');
  }, [initialData]);

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

      alert(`---TODO--- Comment updated: ${newValue}`);
    }
  };

  return (
    <div>
      <Textarea ref={textareaRef} value={comment} onChange={(e) => setComment(e.target.value)} onBlur={handlePost} />
    </div>
  );
}
