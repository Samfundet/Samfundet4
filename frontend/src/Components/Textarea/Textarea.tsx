import classNames from 'classnames';
import React from 'react';
import styles from './Textarea.module.scss';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return <textarea className={classNames(styles.textarea, className)} ref={ref} {...props} />;
});
Textarea.displayName = 'Textarea';

export { Textarea };
