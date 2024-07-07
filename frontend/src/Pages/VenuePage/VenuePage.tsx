import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { DynamicBuildingMap } from '~/Components/DynamicBuildingMap';
import { Page } from '~/Components/Page';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { backgroundImageFromUrl } from '~/utils';
import styles from './VenuePage.module.scss';
import { VENUES } from './data';

export function VenuePage() {
  const { t } = useTranslation();
  const [highlightKey, setHighlight] = useState<string | undefined>(undefined);
  useTitle(t(KEY.venuepage_title));
  function openVenue(key?: string) {
    if (key !== undefined) {
      toast.error(`TODO Open venue '${key}'`);
    }
  }

  return (
    <Page className={styles.page}>
      <div className={styles.container}>
        <div className={styles.map_container}>
          <h1 className={styles.header}>{t(KEY.venuepage_title)}</h1>
          <DynamicBuildingMap highlightKey={highlightKey} onSetHighlight={setHighlight} onClickedVenue={openVenue} />
        </div>
        <div className={styles.venues}>
          {VENUES.map((image, idx) => {
            const key = image.name.toLowerCase();
            return (
              <div
                key={idx}
                className={classNames(styles.venue, highlightKey === key && styles.hover)}
                onClick={() => openVenue(key)}
              >
                <div
                  className={styles.venue_image}
                  style={backgroundImageFromUrl(image.src)}
                  onMouseEnter={() => setHighlight(key)}
                  onMouseLeave={() => setHighlight(undefined)}
                ></div>
                <div className={styles.venue_name}>{image.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
