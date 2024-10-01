import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { Button, Link, Navbar } from '~/Components';
import type { Applet } from '~/Components/AdminBox/types';
import { appletCategories } from '~/Pages/AdminPage/applets';
import { useAuthContext } from '~/context/AuthContext';
import { useMobile } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { dbT } from '~/utils';
import styles from './AdminLayout.module.scss';

/**
 * Wraps admin routes with the standard navbar and a side panel with common links
 * for editing events, groups, etc.
 * @returns Layout with outlet
 */
export function AdminLayout() {
  const { t } = useTranslation();
  const [panelOpen, setPanelOpen] = useState(false);
  const isMobile = useMobile();
  const location = useLocation();
  const { loading: authLoading } = useAuthContext();

  const makeAppletShortcut = useCallback(
    (applet: Applet, index: number) => {
      // No default url, dont show in navmenu
      if (applet.url === undefined) return <></>;

      // Create panel item
      const selected = location.pathname.toLowerCase().indexOf(applet.url) !== -1;
      return (
        <Link
          key={index}
          className={classNames(styles.panel_item, selected && styles.selected)}
          url={applet.url}
          onAfterClick={() => isMobile && panelOpen && setPanelOpen(false)}
          plain={true}
        >
          <Icon icon={applet.icon} />
          {dbT(applet, 'title')}
        </Link>
      );
    },
    [location, isMobile, panelOpen],
  );

  const selectedIndex = window.location.href.endsWith(ROUTES_FRONTEND.admin);

  useEffect(() => {
    if (!isMobile) {
      setPanelOpen(true);
    }
  }, [isMobile]);

  const panel = (
    <div className={classNames(styles.panel, !panelOpen && styles.mobile_panel_closed)}>
      <button type="button" className={styles.mobile_panel_close_btn} onClick={() => setPanelOpen(false)}>
        <Icon icon="mdi:close" width={24} />
      </button>

      {/* Header */}
      <div className={styles.panel_header}>{t(KEY.control_panel_title)}</div>
      {/* Index */}
      <Link className={classNames(styles.panel_item, selectedIndex && styles.selected)} url={ROUTES_FRONTEND.admin}>
        <Icon icon="mdi:person" />
        {t(KEY.common_profile)}
      </Link>
      <br />
      {/* Applets */}
      {appletCategories.map((category) => {
        return (
          <React.Fragment key={category.title_en}>
            <div className={styles.category_header}>{dbT(category, 'title')}</div>
            {category.applets.map((applet, index) => makeAppletShortcut(applet, index))}
          </React.Fragment>
        );
      })}
      <br />
      {/* TODO help/faq */}
      <Link className={classNames(styles.panel_item)} url={ROUTES_FRONTEND.admin}>
        <Icon icon="material-symbols:question-mark-rounded" />
        {t(KEY.control_panel_faq)}
      </Link>
    </div>
  );

  const mobileOpen = (
    <>
      <div className={styles.mobile_header}>
        <Button theme="samf" onClick={() => setPanelOpen(!panelOpen)}>
          <Icon icon="ci:hamburger-md" /> {t(KEY.common_open)} {t(KEY.control_panel_title)}
        </Button>
      </div>
    </>
  );

  const desktopOpen = (
    <button type="button" className={styles.open_panel_desktop} onClick={() => setPanelOpen(true)}>
      <Icon icon="mdi:arrow-right-bold" width={16} className={styles.arrow} />
    </button>
  );

  return (
    <div>
      <Navbar />
      {!authLoading && (
        <div className={styles.wrapper}>
          {panel}
          {!panelOpen && (isMobile ? mobileOpen : desktopOpen)}
          {/* Content */}
          <div className={classNames(styles.content_wrapper, !panelOpen && styles.closed_panel_content_wrapper)}>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
