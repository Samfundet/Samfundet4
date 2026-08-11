import Markdown, { type Components, defaultUrlTransform } from 'react-markdown';
import remarkDirective from 'remark-directive';
import { BACKEND_DOMAIN, UPLOADS_PREFIX } from '~/constants';
import { SamfImage } from './SamfImage';
import styles from './SamfMarkdown.module.scss';
import { remarkSamfImage } from './remarkSamfImage';

type Props = {
  markdown: string | undefined;
};

function urlTransform(url: string): string {
  if (url.startsWith(UPLOADS_PREFIX)) {
    return BACKEND_DOMAIN + url;
  }
  return defaultUrlTransform(url);
}

export function SamfMarkdown({ markdown }: Props) {
  return (
    <div className={styles.samf_markdown}>
      <Markdown
        remarkPlugins={[remarkDirective, remarkSamfImage]}
        urlTransform={urlTransform}
        components={{ samfimage: SamfImage } as Components}
      >
        {markdown ?? ''}
      </Markdown>
    </div>
  );
}
