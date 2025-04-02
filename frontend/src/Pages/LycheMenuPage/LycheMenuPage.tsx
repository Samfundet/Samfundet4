import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LycheFrame } from '~/Components/LycheFrame';
import { LycheMenuDivider } from '~/Components/LycheMenuDivider/LycheMenuDivider';
import { MenuItem } from '~/Components/MenuItem';
import { SultenPage } from '~/Components/SultenPage';
import { getMenu, getMenus } from '~/api';
import menuLogo from '~/assets/lyche/menu-logo.png';
import { TextItem } from '~/constants';
import { useTitle } from '~/hooks';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './LycheMenuPage.module.scss';

export function LycheMenuPage() {
  const { t, i18n } = useTranslation();

  const introTexts = [
    { key: 'intro-main', text: useTextItem(TextItem.sulten_menu_introduction_text_1) },
    { key: 'intro-quality', text: useTextItem(TextItem.sulten_menu_introduction_text_2) },
    { key: 'intro-pricing', text: useTextItem(TextItem.sulten_menu_introduction_text_3) },
  ];

  const currentLanguage = i18n.language;
  useTitle(t(KEY.common_menu), t(KEY.common_sulten));

  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      return await getMenus();
    },
  });

  const menuId = menus && menus.length > 0 ? menus[0].id : null; // Mulig dette må endres hvis vi får flere menyer, vet ikke helt hvordan dette er ment å fungere. Finnes kun én meny per nå så bruker bare den første

  const { data, error, isLoading } = useQuery({
    queryKey: ['menu', menuId],
    queryFn: async () => {
      if (!menuId) return null;
      return await getMenu(menuId);
    },
    enabled: !!menuId,
  });

  // Process menu data to group by food category
  const groupedMenuItems = React.useMemo(() => {
    if (!data?.menu_items) return {};

    return data.menu_items.reduce(
      (acc: Record<string, { id: number; name: string; items: typeof data.menu_items }>, item) => {
        const categoryId = typeof item.food_category === 'object' ? item.food_category.id : item.food_category;

        if (categoryId === undefined) return acc; // Skip items with undefined categoryId
        const categoryName = typeof item.food_category === 'object' ? dbT(item.food_category, 'name') : '';

        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            name: categoryName ?? '',
            items: [],
          };
        }

        acc[categoryId].items.push(item);
        return acc;
      },
      {} as Record<string, { id: number; name: string; items: typeof data.menu_items }>,
    );
  }, [data?.menu_items, currentLanguage]);

  // Sort categories by their ID to maintain order
  const sortedCategories = React.useMemo(() => {
    return Object.values(groupedMenuItems).sort((a, b) => a.id - b.id);
  }, [groupedMenuItems]);

  if (isLoading) return <div>Loading menu...</div>;
  if (error) return <div>Error loading menu</div>;

  return (
    <SultenPage>
      <LycheFrame>
        <img className={styles.menu_logo} src={menuLogo} alt="Menu Logo" />
        <h1 className={styles.menu_header}> {t(KEY.common_menu)}</h1>
        {introTexts.map((item) => (
          <section key={item.key} className={styles.menu_introduction}>
            {item.text}
          </section>
        ))}
        <h2 className={styles.menu_header2}> {t(KEY.sulten_menu_you_are_welcome)} </h2>
        <h1 className={styles.menu_header}> {t(KEY.common_opening_hours)}</h1>
        <section className={styles.opening_hours}>
          <p>
            {t(KEY.common_day_monday)} - {t(KEY.common_day_thursday)}: 16:00 - 23:00
          </p>
          <p>
            {t(KEY.common_day_friday)} - {t(KEY.common_day_saturday)}: 16:00 - 02:00
          </p>
          <p> {t(KEY.common_day_sunday)}: 16:00 - 21:00 </p>
        </section>

        {sortedCategories.map((category) => (
          <React.Fragment key={category.id}>
            <LycheMenuDivider title={category.name} />
            {category.items.map((item) => (
              <MenuItem
                key={item.id}
                dishTitle={dbT(item, 'name') ?? ''}
                dishDescription={dbT(item, 'description') ?? ''}
                allergens="Allgergener: Mel, Egg " // Not in seed data yet, see issue #1863
                recommendations="Anbefalinger: Noe godt i glasset " // Not in seed data yet, see issue #1863
                price={`${item.price_member},- / ${item.price},-`}
              />
            ))}
          </React.Fragment>
        ))}
      </LycheFrame>
    </SultenPage>
  );
}
