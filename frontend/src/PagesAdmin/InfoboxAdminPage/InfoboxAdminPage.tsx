import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Link } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { deleteInfobox, getInfoboxes } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { infoboxKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { dbT, hasPermissions, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InfoboxAdminPage.module.scss';

export function InfoboxAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const pageTitle = t(KEY.admin_infoboxes_title);

  useTitle(pageTitle);

  const { data: infoboxes = [], isLoading: showSpinner } = useQuery({
    queryKey: infoboxKeys.all,
    queryFn: getInfoboxes,
  });

  const deleteInfoboxMutation = useMutation({
    mutationFn: (id: number) => deleteInfobox(id),
  });

  function handleDelete(id: number) {
    deleteInfoboxMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t(KEY.common_delete_successful));
        queryClient.invalidateQueries({ queryKey: infoboxKeys.all });
      },
      onError: (error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      },
    });
  }

  const tableColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.common_description), sortable: true },
    { content: 'Color', sortable: true },
    { content: 'URL', sortable: true },
    '',
  ];

  const tableData = infoboxes.map((infobox) => ({
    cells: [
      dbT(infobox, 'title') as string,
      dbT(infobox, 'text') as string,
      infobox.color,
      {
        content: infobox.url ? (
          <Link url={infobox.url} target="external">
            {infobox.url}
          </Link>
        ) : (
          '-'
        ),
        value: infobox.url ?? '',
      },
      {
        content: (
          <CrudButtons
            onEdit={
              hasPermissions(user, [PERM.SAMFUNDET_CHANGE_INFOBOX], infobox.id, true) &&
              (() => {
                navigate({
                  url: reverse({
                    pattern: ROUTES.frontend.admin_infobox_edit,
                    urlParams: { id: infobox.id },
                  }),
                });
              })
            }
            onDelete={
              hasPermissions(user, [PERM.SAMFUNDET_DELETE_INFOBOX], infobox.id, true) &&
              (() => {
                if (window.confirm(t(KEY.form_confirm) ?? '')) {
                  handleDelete(infobox.id);
                }
              })
            }
          />
        ),
      },
    ],
  }));

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_INFOBOX], undefined, true);

  const header = canCreate && (
    <Button theme="success" rounded={true} link={ROUTES.frontend.admin_infobox_create}>
      {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_infobox)}`)}
    </Button>
  );

  return (
    <AdminPageLayout title={pageTitle} header={header} loading={showSpinner}>
      <div className={styles.table_container}>
        <Table columns={tableColumns} data={tableData} />
      </div>
    </AdminPageLayout>
  );
}
