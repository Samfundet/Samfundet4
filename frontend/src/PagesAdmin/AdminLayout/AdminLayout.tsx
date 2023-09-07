import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Link, Navbar } from '~/Components';
import { Applet } from '~/Components/AdminBox/types';
import { appletCategories } from '~/Pages/AdminPage/applets';
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
        plain={true}
      >
        <Icon icon={applet.icon} />
        {dbT(applet, 'title')}
      </Link>
    );
  }

  const selectedIndex = window.location.href.endsWith(ROUTES_FRONTEND.admin);

  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          {/* Header */}
          <div className={styles.panel_header}>{t(KEY.control_panel_title)}</div>
          {/* Index */}
          <Link className={classNames(styles.panel_item, selectedIndex && styles.selected)} url={ROUTES_FRONTEND.admin}>
            <Icon icon="mdi:person" />
            Profil {/* TODO translate */}
          </Link>
          <br></br>
          {/* Applets */}
          {appletCategories.map((category) => {
            return (
              <>
                <div className={styles.category_header}>{dbT(category, 'title')}</div>
                {category.applets.map((applet, index) => makeAppletShortcut(applet, index))}
              </>
            );
          })}
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
