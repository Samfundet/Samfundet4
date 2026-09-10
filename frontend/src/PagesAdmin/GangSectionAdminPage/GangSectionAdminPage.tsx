import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { Button, Link } from '~/Components';
import { buttonThemes } from '~/Components/Button/utils';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useAuthContext } from '~/context/AuthContext';
import { useGangSectionMutations } from '~/domain/gangsection/mutations';
import type { GangSectionDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import type { GangLoader, GangSectionLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { dbT, formatSectionName, hasPermissions } from '~/utils';
import styles from './GangSectionAdminPage.module.scss';

export function GangSectionAdminPage() {
  const { gang } = useRouteLoaderData('admin-gang') as GangLoader;
  const { section } = useRouteLoaderData('admin-gang-section') as GangSectionLoader;
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const { deleteGangSection } = useGangSectionMutations();
  const navigate = useCustomNavigate();

  const title = formatSectionName(section as GangSectionDto, gang);

  useTitle(title);

  const canEdit = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_CHANGE_GANGSECTION], section?.id, true);
  }, [section, user]);
  const canDelete = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_DELETE_GANGSECTION], section?.id, true);
  }, [section, user]);

  function handleDelete() {
    if (section && canDelete && window.confirm(`${t(KEY.form_confirm_delete)} ${dbT(section, 'name')}`)) {
      deleteGangSection.mutate(section.id, {
        onSuccess: () => {
          navigate({
            url: reverse({
              pattern: ROUTES.frontend.admin_gangs_view,
              urlParams: { gangId: gang?.id },
            }),
          });
        },
      });
    }
  }

  const header = (
    <div className={styles.header}>
      {canEdit && (
        <Link
          url={reverse({
            pattern: ROUTES.frontend.admin_gang_section_edit,
            urlParams: { gangId: gang?.id, sectionId: section?.id },
          })}
          className={buttonThemes.secondary}
          plain
        >
          <Icon icon="lucide:pencil" />
          {t(KEY.common_edit)}
        </Link>
      )}

      {canDelete && (
        <Button type="button" theme="ghost" onClick={handleDelete}>
          <Icon icon="mdi:bin" />
          {t(KEY.common_delete)}
        </Button>
      )}
    </div>
  );

  return (
    <AdminPageLayout title={title} header={header}>
      {dbT(section as GangSectionDto, 'name')}
      {/*  TODO: Show stuff based on user permissions: positions, info pages, etc. */}
    </AdminPageLayout>
  );
}
