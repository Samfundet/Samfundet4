import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownEditor } from '~/Components';
import { type Tab, TabBar } from '~/Components/TabBar/TabBar';
import type { InformationPageRevisionDetailDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './RevisionContent.module.scss';

type Language = 'nb' | 'en';

type RevisionContentProps = {
  revision: InformationPageRevisionDetailDto;
  previousRevision?: InformationPageRevisionDetailDto;
  previousFailed?: boolean;
};

export function RevisionContent({ revision, previousRevision, previousFailed }: RevisionContentProps) {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<Language>('nb');

  const tabs: Tab<Language>[] = [
    { key: 'nb', label: t(KEY.common_norwegian), value: 'nb' },
    { key: 'en', label: t(KEY.common_english), value: 'en' },
  ];

  return (
    <div className={styles.revision}>
      <h2 className={styles.revision_title}>{`${t(KEY.common_version)} ${revision.version}`}</h2>
      <TabBar
        tabs={tabs}
        selected={tabs.find((tab) => tab.value === language)}
        onSetTab={(tab) => tab.value && setLanguage(tab.value)}
      />

      {previousFailed && <p className={styles.diff_unavailable}>{t(KEY.admin_information_history_diff_failed)}</p>}

      <MarkdownEditor
        key={`${revision.version}-${language}`}
        disabled
        hideEditButtons
        viewMode={previousFailed ? 'rich-text' : 'diff'}
        defaultValue={revision[`text_${language}`] ?? ''}
        initialValue={previousRevision?.[`text_${language}`] ?? ''}
      />
    </div>
  );
}
