import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Link } from '~/Components';
import { Navbar } from '~/Components/NavbarSamfThree';
import { appletCategories } from '~/PagesAdmin/AdminLayout/applets';
import { logout, stopImpersonatingUser } from '~/api';
import { isSiteFeatureEnabled } from '~/constants/site-features';
import { useAuthContext } from '~/context/AuthContext';
import { useMobile, useSidePanelState } from '~/hooks';
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
  const isMobile = useMobile();
  const [isPanelOpen, setPanelOpen] = useSidePanelState();
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies] = useCookies(['impersonated_user_id']);
  const { setUser, loading: authLoading } = useAuthContext();

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
      // No default url, don't show in navmenu
      if (applet.url === undefined) return <></>;

      // TODO: replace hacky solution of excluding /control-panel/. Maybe we can check breadcrumbs for a match?
      const selected =
        location.pathname === applet.url ||
        (location.pathname.startsWith(applet.url) && !applet.url.endsWith('/control-panel/'));

      return (
        <Link
          key={index}
          className={classNames(styles.panel_item, selected && styles.selected)}
          url={applet.url}
          onAfterClick={() => isMobile && isPanelOpen && setPanelOpen(false)}
          plain={true}
        >
          <Icon icon={applet.icon} />
          {isPanelOpen && dbT(applet, 'title')}
        </Link>
      );
    },
    [location, isMobile, isPanelOpen, setPanelOpen],
  );

  const userAppletsRaw: AdminApplet[] = [
    { url: ROUTES_FRONTEND.admin, icon: 'mdi:house', title_nb: 'Hjem', title_en: 'Home' },
    { url: ROUTES_FRONTEND.account, icon: 'mdi:person', title_nb: 'Konto', title_en: 'Account' },
  ];

  const userApplets = userAppletsRaw.filter((a) => !a.feature || isSiteFeatureEnabled(a.feature));

  const panel = (
    <>
      <div className={classNames(styles.panel, !isPanelOpen && styles.panel_closed)}>
        <div className={styles.panel_header}>
          {isPanelOpen && <span>{t(KEY.control_panel_title)}</span>}
          <button type="button" className={styles.panel_close_btn} onClick={() => setPanelOpen(!isPanelOpen)}>
            <Icon icon="lucide:arrow-left-from-line" rotate={isPanelOpen ? 0 : 2} />
          </button>
        </div>
        {userApplets.map((applet, index) => makeAppletShortcut(applet, index))}

        <br />

        {appletCategories.map((category) => {
          // Keep only the applets with enabled features visible
          const visibleApplets = category.applets.filter(
            (applet) => !applet.feature || isSiteFeatureEnabled(applet.feature),
          );

          if (visibleApplets.length === 0) return null;

          return (
            <React.Fragment key={category.title_en}>
              {isPanelOpen ? (
                <div className={styles.category_header}>{dbT(category, 'title')}</div>
              ) : (
                <hr className={styles.separator} />
              )}

              {visibleApplets.map((applet, index) => makeAppletShortcut(applet, index))}
            </React.Fragment>
          );
        })}
        <br />

        {/* TODO help/faq (Hidden until ready)*/}
        {isSiteFeatureEnabled('faq') && (
          <Link className={classNames(styles.panel_item)} url={ROUTES_FRONTEND.admin}>
            <Icon icon="material-symbols:question-mark-rounded" />
            {t(KEY.control_panel_faq)}
          </Link>
        )}

        <div className={styles.bottom_items}>
          <hr className={styles.separator} />

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

          <Link
            url={ROUTES.frontend.admin_mdb_connect}
            className={classNames(styles.panel_item, {
              [styles.selected]: location.pathname === ROUTES.frontend.admin_mdb_connect,
            })}
          >
            <Icon icon="mdi:connection" />
            {isPanelOpen && t(KEY.common_member_database)}
          </Link>

          <button
            type="button"
            className={classNames(styles.panel_item, styles.panel_item_button)}
            onClick={handleLogout}
          >
            <Icon icon="material-symbols:logout" />
            {isPanelOpen && t(KEY.common_logout)}
          </button>
        </div>
      </div>
      {isPanelOpen && isMobile && (
        <button
          type="button"
          className={classNames(styles.mobile_panel_backdrop)}
          onClick={() => setPanelOpen(false)}
        />
      )}
    </>
  );

  const mobileOpen = (
    <button type="button" className={styles.mobile_open_button} onClick={() => setPanelOpen(true)}>
      <Icon icon="carbon:chevron-right" />
    </button>
  );

  return (
    <div>
      <Navbar />
      {!authLoading && (
        <div className={styles.wrapper}>
          {panel}
          {!isPanelOpen && isMobile && mobileOpen}

          <div className={classNames(styles.content_wrapper, !isPanelOpen && styles.closed_panel_content_wrapper)}>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
