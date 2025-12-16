import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { Button, Link, Navbar } from '~/Components';
import { appletCategories } from '~/Pages/AdminPage/applets';
import { logout, stopImpersonatingUser } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { useMobile } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import type { AdminApplet } from '~/types';
import { dbT } from '~/utils';
import styles from './AdminLayout.module.scss';

/**
 * Wraps admin routes with the standard navbar and a side panel with common links
 * for editing events, gangs, etc.
 * @returns Layout with outlet
 */
export function AdminLayout() {
  const { t } = useTranslation();
  const [panelOpen, setPanelOpen] = useState(false);
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const { user, setUser, loading: authLoading } = useAuthContext();

  const isImpersonating = Object.hasOwn(cookies, 'impersonated_user_id');

  function handleLogout() {
    logout()
      .then((response) => {
        if (response.status === STATUS.HTTP_200_OK) {
          setUser(undefined);
          navigate(ROUTES.frontend.home);
        }
      })
      .catch(console.error);
  }

  function handleStopImpersonating() {
    stopImpersonatingUser()
      .then(() => {
        window.location.reload();
      })
      .catch(console.error);
  }

  const makeAppletShortcut = useCallback(
    (applet: AdminApplet, index: number) => {
      // No default url, dont show in navmenu
      if (applet.url === undefined) return <></>;

      // Create panel item
      const selected = location.pathname === applet.url;
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

  useEffect(() => {
    if (!isMobile) {
      setPanelOpen(true);
    }
  }, [isMobile]);

  const userApplets: AdminApplet[] = [
    { url: ROUTES_FRONTEND.admin, icon: 'mdi:person', title_nb: 'Profil', title_en: 'Profile' },
    {
      url: ROUTES_FRONTEND.user_change_password,
      icon: 'mdi:password',
      title_nb: 'Bytt passord',
      title_en: 'Change password',
    },
  ];

  const panel = (
    <div className={classNames(styles.panel, !panelOpen && styles.mobile_panel_closed)}>
      <button type="button" className={styles.mobile_panel_close_btn} onClick={() => setPanelOpen(false)}>
        <Icon icon="mdi:close" width={24} />
      </button>

      {/* Header */}
      <div className={styles.panel_header}>{t(KEY.control_panel_title)}</div>
      {/* Index */}
      {userApplets.map((applet, index) => makeAppletShortcut(applet, index))}
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

      <div className={styles.bottom_items}>
        <div className={styles.separator} />
        {/* Stop Impersonating */}
        {isImpersonating && (
          <button
            type="button"
            className={classNames(styles.panel_item, styles.panel_item_button)}
            onClick={handleStopImpersonating}
          >
            <Icon icon="ri:spy-fill" />
            {t(KEY.admin_stop_impersonate)}
          </button>
        )}
        {/* Logout */}
        <button
          type="button"
          className={classNames(styles.panel_item, styles.panel_item_button)}
          onClick={handleLogout}
        >
          <Icon icon="material-symbols:logout" />
          {t(KEY.common_logout)}
        </button>
      </div>
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
