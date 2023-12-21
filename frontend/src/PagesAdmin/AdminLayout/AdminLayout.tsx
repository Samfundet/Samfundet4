import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Button, Link, Navbar } from '~/Components';
import { Applet } from '~/Components/AdminBox/types';
import { appletCategories } from '~/Pages/AdminPage/applets';
import { KEY } from '~/i18n/constants';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { dbT } from '~/utils';
import styles from './AdminLayout.module.scss';
import { useMobile } from '~/hooks';

/**
 * Wraps admin routes with the standard navbar and a side panel with common links
 * for editing events, groups, etc.
 * @returns Layout with outlet
 */
export function AdminLayout() {
  const { t } = useTranslation();
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const isMobile = useMobile();

  function makeAppletShortcut(applet: Applet, index: number) {
    // No default url, dont show in navmenu
    if (applet.url === undefined) return <></>;

    // Create panel item
    const selected = window.location.href.toLowerCase().indexOf(applet.url) != -1;
    return (
      <Link
        key={index}
        className={classNames(styles.panel_item, selected && styles.selected)}
        url={applet.url}
        onAfterClick={() => mobilePanelOpen && setMobilePanelOpen(false)}
        plain={true}
      >
        <Icon icon={applet.icon} />
        {dbT(applet, 'title')}
      </Link>
    );
  }

  const selectedIndex = window.location.href.endsWith(ROUTES_FRONTEND.admin);

  useEffect(() => {
    if (!isMobile) {
      setMobilePanelOpen(false);
    }
  }, [isMobile]);

  const panel = (
    <div className={classNames(styles.panel, isMobile && !mobilePanelOpen && styles.mobile_panel_closed)}>
      {isMobile && (
        <button className={styles.mobile_panel_close_btn} onClick={() => setMobilePanelOpen(false)}>
          <Icon icon="mdi:close" width={24} />
        </button>
      )}

      {/* Header */}
      <div className={styles.panel_header}>{t(KEY.control_panel_title)}</div>
      {/* Index */}
      <Link
        className={classNames(styles.panel_item, selectedIndex && styles.selected)}
        url={ROUTES_FRONTEND.admin}
        onAfterClick={() => mobilePanelOpen && setMobilePanelOpen(false)}
      >
        <Icon icon="mdi:person" />
        {t(KEY.common_profile)}
      </Link>
      <br></br>
      {/* Applets */}
      {appletCategories.map((category) => {
        return (
          <React.Fragment key={category.title_en}>
            <div className={styles.category_header}>{dbT(category, 'title')}</div>
            {category.applets.map((applet, index) => makeAppletShortcut(applet, index))}
          </React.Fragment>
        );
      })}
      <br></br>
      {/* TODO help/faq */}
      <Link className={classNames(styles.panel_item)} url={ROUTES_FRONTEND.admin}>
        <Icon icon="material-symbols:question-mark-rounded" />
        {t(KEY.control_panel_faq)}
      </Link>
    </div>
  );

  const mobileHeader = (
    <>
      <div className={styles.mobile_header}>
        <Button theme="samf" onClick={() => setMobilePanelOpen(!mobilePanelOpen)}>
          <Icon icon="ci:hamburger-md" /> {t(KEY.common_open)} {t(KEY.control_panel_title)}
        </Button>
      </div>
      <div
        className={classNames(styles.mobile_backdrop, mobilePanelOpen && styles.mobile_backdrop_open)}
        onClick={() => setMobilePanelOpen(false)}
      ></div>
    </>
  );

  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}>
        {isMobile && mobileHeader}
        {panel}
        {/* Content */}
        <div className={styles.content_wrapper}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
