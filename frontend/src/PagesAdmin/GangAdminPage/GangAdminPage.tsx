import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { Button, CrudButtons, H2, Link, Table } from '~/Components';
import { buttonThemes } from '~/Components/Button/utils';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { BACKEND_DOMAIN } from '~/constants';
import { useAuthContext } from '~/context/AuthContext';
import { useGangMutations } from '~/domain';
import { useGetAdminGangSections } from '~/domain/gangs/queries';
import { useGangSectionMutations } from '~/domain/gangsection/mutations';
import type { GangDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import type { GangLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { dbT, formatGangName, hasPermissions, lowerCapitalize } from '~/utils';
import styles from './GangAdminPage.module.scss';

export function GangAdminPage() {
  const { t } = useTranslation();
  const { gang } = useRouteLoaderData('admin-gang') as GangLoader;
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();

  const title = gang ? formatGangName(gang) : lowerCapitalize(`${t(KEY.common_show)} ${t(KEY.common_gang)}`);
  useTitle(title);

  const canCreateSection = hasPermissions(user, [PERM.SAMFUNDET_ADD_GANGSECTION], gang);
  const canEdit = hasPermissions(user, [PERM.SAMFUNDET_CHANGE_GANG], gang);
  const canDelete = hasPermissions(user, [PERM.SAMFUNDET_DELETE_GANG], gang);

  const { data: sections, isLoading: isSectionsLoading } = useGetAdminGangSections((gang as GangDto).id, {
    enabled: !!gang,
  });

  const { deleteGang } = useGangMutations();
  const { deleteGangSection } = useGangSectionMutations();

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  const tableData = useMemo(() => {
    return sections?.map((section) => {
      const canView = hasPermissions(user, [PERM.SAMFUNDET_VIEW_GANGSECTION], section);
      const canEdit = hasPermissions(user, [PERM.SAMFUNDET_CHANGE_GANGSECTION], section);
      const canDelete = hasPermissions(user, [PERM.SAMFUNDET_DELETE_GANGSECTION], section);

      const sectionName = dbT(section, 'name') ?? '';

      const viewUrl = reverse({
        pattern: ROUTES.frontend.admin_gang_section_view,
        urlParams: { gangId: (gang as GangDto).id, sectionId: section.id },
      });
      const editUrl = reverse({
        pattern: ROUTES.frontend.admin_gang_section_edit,
        urlParams: { gangId: (gang as GangDto).id, sectionId: section.id },
      });

      return {
        cells: [
          {
            content: section.logo && <img className={styles.logo} alt="" src={BACKEND_DOMAIN + section.logo} />,
          },
          {
            content: canView ? <Link url={viewUrl}>{sectionName}</Link> : sectionName,
          },
          {
            content: (
              <CrudButtons
                onView={canView && viewUrl}
                onEdit={canEdit && editUrl}
                onDelete={
                  canDelete &&
                  (() => {
                    if (window.confirm(`${t(KEY.form_confirm_delete)} ${sectionName}?`)) {
                      deleteGangSection.mutate(section.id, {
                        onSuccess: () => {
                          // TODO: invalidating queryKey doesn't work since our gang data is loaded outside RQ...
                          window.location.reload();
                        },
                      });
                    }
                  })
                }
              />
            ),
          },
        ],
      };
    });
  }, [sections, gang]);

  function handleDelete() {
    if (gang && window.confirm(`${t(KEY.form_confirm_delete)} ${dbT(gang, 'name')}?`)) {
      deleteGang.mutate(gang.id, {
        onSuccess: () => navigate({ url: ROUTES.frontend.admin_gangs }),
      });
    }
  }

  const header = (
    <div className={styles.header}>
      {canCreateSection && (
        <Link
          url={reverse({
            pattern: ROUTES.frontend.admin_gang_section_create,
            urlParams: { gangId: gang?.id },
          })}
          className={buttonThemes.primary}
          plain
        >
          <Icon icon="lucide:plus" />
          {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_section)}`)}
        </Link>
      )}

      {canEdit && (
        <Link
          url={reverse({
            pattern: ROUTES.frontend.admin_gangs_edit,
            urlParams: { gangId: gang?.id },
          })}
          className={buttonThemes.secondary}
          plain
        >
          <Icon icon="lucide:pencil" />
          {t(KEY.common_edit)}
        </Link>
      )}

      {canDelete && (
        <Button type="button" theme="ghost" onClick={handleDelete} disabled={(sections?.length ?? 0) > 0}>
          <Icon icon="mdi:bin" />
          {t(KEY.common_delete)}
        </Button>
      )}
    </div>
  );

  return (
    <AdminPageLayout
      title={title}
      header={header}
      loading={isSectionsLoading}
      backendUrl={reverse({
        pattern: ROUTES.backend.admin__samfundet_gang_change,
        urlParams: { objectId: gang?.id },
      })}
    >
      <H2>{t(KEY.common_sections)}</H2>
      {sections?.length ? (
        <Table columns={['', t(KEY.common_name) ?? '', '']} data={tableData ?? []} bodyRowClassName={styles.row} />
      ) : (
        <span>{t(KEY.admin_gang_has_no_sections)}</span>
      )}

      {/*  TODO: Show stuff based on user permissions: positions, info pages, etc. Preferably as small cards on
                 the top of the page, which link to the relevant pages, such as the InfoPagesAdmin, with gang as
                 a pre-set filter. A simple object count will do, no listings. */}
    </AdminPageLayout>
  );
}
