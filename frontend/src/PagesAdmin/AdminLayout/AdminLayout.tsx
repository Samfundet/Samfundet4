import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Link, Navbar } from '~/Components';
import { applets } from '~/Pages/AdminPage/applets';
import { KEY } from '~/i18n/constants';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import styles from './AdminLayout.module.scss';

/**
 * Wraps admin routes with the standard navbar and a side panel with common links
 * for editing events, groups, etc.
 * @returns Layout with outlet
 */
export function AdminLayout() {
  const { t } = useTranslation();

  const appletShortcuts = applets.map((applet, index) => {
    // No default url, dont show in navmenu
    if (applet.defaultUrl === undefined) return undefined;

    // Create panel item
    const selected = window.location.href.toLowerCase().indexOf(applet.defaultUrl) != -1;
    return (
      <Link key={index} className={classNames(styles.panel_item, selected && styles.selected)} url={applet.defaultUrl}>
        <Icon icon={applet.icon} />
        {applet.title}
      </Link>
    );
  });

  const selectedIndex = window.location.href.endsWith(ROUTES_FRONTEND.admin);

  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          {/* Header */}
          <div className={styles.panel_header}>
            <Icon icon="mdi:gear" />
            {t(KEY.control_panel_title)}
          </div>
          {/* Index */}
          <Link className={classNames(styles.panel_item, selectedIndex && styles.selected)} url={ROUTES_FRONTEND.admin}>
            <Icon icon="material-symbols:grid-view-rounded" />
            Oversikt
          </Link>
          <br></br>
          {/* Applets */}
          {appletShortcuts}
          <br></br>
          {/* TODO help/faq */}
          <Link className={classNames(styles.panel_item)} url={ROUTES_FRONTEND.admin}>
            <Icon icon="material-symbols:question-mark-rounded" />
            {t(KEY.control_panel_faq)}
          </Link>
        </div>
        {/* Content */}
        <div className={styles.content_wrapper}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
