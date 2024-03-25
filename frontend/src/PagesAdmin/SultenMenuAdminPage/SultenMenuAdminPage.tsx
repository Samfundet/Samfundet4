import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { getMenuItems, getMenus } from '~/api';
import { FoodCategoryDto, MenuDto, MenuItemDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SultenMenuAdminPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { reverse } from '~/named-urls';

export function SultenMenuAdminPage() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Get Menus and Menuitems
  useEffect(() => {
    Promise.all([
      getMenuItems()
        .then((data) => {
          setMenuItems(data);
          console.log(data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
      getMenus()
        .then((data) => {
          setMenus(data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
    ]).then(() => {
      setShowSpinner(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableMenuItemsColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: 'Type', sortable: true },
    { content: t(KEY.common_price), sortable: true },
    '', // Buttons
  ];

  // Table row for a menuitem
  function menuItemsTableRow(menuItem: MenuItemDto) {
    return [
      dbT(menuItem, 'name'),
      menuItem.food_category ? dbT(menuItem.food_category as FoodCategoryDto, 'name') : '',
      (menuItem.price_member + '/' + menuItem.price) as string,
      {
        content: (
          <CrudButtons
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_sulten_menuitem_edit,
                  urlParams: { id: menuItem.id },
                }),
              );
            }}
          />
        ),
      },
    ];
  }

  const tableMenusColumns = [
    { content: t(KEY.common_name), sortable: true },
    '', // Buttons
  ];

  function menuTableRow(menu: MenuDto) {
    return [
      dbT(menu, 'name'),
      {
        content: (
          <CrudButtons
            onEdit={() => {
              alert('TODO add edit menu');
            }}
          />
        ),
      },
    ];
  }

  const title = t(KEY.admin_sultenmenu_title);
  const backendUrl = ROUTES.backend.admin__samfundet_menuitem_changelist;
  const header = (
    <div className={styles.headerRow}>
      <Button theme="success" rounded={true} link={ROUTES.frontend.admin_sulten_menuitem_create}>
        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.sulten_dishes)}`)}
      </Button>
      <Button theme="success" rounded={true} onClick={() => alert('TODO create menu')}>
        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_menu)}`)}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <div>
        <h2 className={styles.subheader}>{t(KEY.sulten_dishes)}</h2>
        <Table columns={tableMenuItemsColumns} data={menuItems.map((item) => menuItemsTableRow(item))} />
      </div>

      <div>
        <h2 className={styles.subheader}>{t(KEY.common_menu)}</h2>
        <Table columns={tableMenusColumns} data={menus.map((item) => menuTableRow(item))} />
      </div>
    </AdminPageLayout>
  );
}
