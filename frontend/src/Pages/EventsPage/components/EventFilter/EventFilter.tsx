import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, InputField } from '~/Components';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './EventFilter.module.scss';

export type ViewType = 'grid' | 'table';

type EventFilterProps = {
  setViewType: (type: ViewType) => void;
};

export function EventFilter({ setViewType }: EventFilterProps) {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const isDesktop = useDesktop();

  function getButton(title: string, icon: string, type: 'grid' | 'table') {
    return (
      <Button rounded={true} onClick={() => setViewType(type)} theme="blue">
        {title}
        <Icon icon={icon} />
      </Button>
    );
  }

  return (
    <div className={styles.header_row}>
      <div className={styles.header}>{t(KEY.common_events)}</div>

      {/* Search bar */}
      <div className={styles.filter_row}>
        <InputField
          icon="mdi:search"
          labelClassName={styles.search_bar}
          inputClassName={styles.search_bar_field}
          onChange={setQuery}
          value={query}
        />
        {isDesktop && (
          <span className={styles.filter_button}>
            <IconButton
              icon="fluent:options-24-filled"
              title="Filter"
              color={COLORS.black}
              onClick={() => alert('TODO legg til tinius sitt filter')}
            />
          </span>
        )}
      </div>

      <div className={styles.button_row}>
        {getButton(t(KEY.common_card), 'material-symbols:grid-view-rounded', 'grid')}
        {getButton(t(KEY.common_table), 'material-symbols:view-list', 'table')}
      </div>
    </div>
  );
}
