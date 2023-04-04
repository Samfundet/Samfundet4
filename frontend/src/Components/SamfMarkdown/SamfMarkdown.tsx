import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import styles from './SamfMarkdown.module.scss';

type SamfMarkdownProps = {
  children?: string;
};

/** Component for displaying markdown with samf styling */
export function SamfMarkdown({ children = '' }: SamfMarkdownProps) {
  return (
    <div className={styles.samf_markdown}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
