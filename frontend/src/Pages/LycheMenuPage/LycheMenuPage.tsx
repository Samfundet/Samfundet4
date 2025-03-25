import styles from './LycheMenuPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getMenu } from '~/api';
import { LycheFrame } from '~/Components/LycheFrame';
import { LycheMenuDivider } from '~/Components/LycheMenuDivider/LycheMenuDivider';
import { MenuItem } from '~/Components/MenuItem';
import { SultenPage } from '~/Components/SultenPage';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import menuLogo from '~/assets/lyche/menu-logo.png';
import React from 'react';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';

export function LycheMenuPage() {
  const { t, i18n } = useTranslation();
  const menuIntroText1 = useTextItem(TextItem.sulten_menu_introduction_text1);
  const menuIntroText2 = useTextItem(TextItem.sulten_menu_introduction_text2);
  const menuIntroText3 = useTextItem(TextItem.sulten_menu_introduction_text3);

  const currentLanguage = i18n.language;
  useTitle(t(KEY.common_menu), t(KEY.common_sulten));

  const { data, error, isLoading } = useQuery({
    queryKey: ['menu', 7], //hard coded for now, not sure what this should fetch normally - what is the plan with different menus?
    queryFn: async () => {
      const response = await getMenu('7');
      return response;
    },
  });

  // Process menu data to group by food category
  const groupedMenuItems = React.useMemo(() => {
    if (!data?.menu_items) return {};

    return data.menu_items.reduce(
      (acc: Record<string, { id: number; name: string; items: typeof data.menu_items }>, item) => {
        const categoryId = typeof item.food_category === 'object' ? item.food_category.id : item.food_category;

        if (categoryId === undefined) return acc; // Skip items with undefined categoryId
        const categoryName =
          typeof item.food_category === 'object'
            ? currentLanguage === 'nb'
              ? item.food_category.name_nb
              : item.food_category.name_en
            : '';

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
        <section className={styles.menu_introduction}> {menuIntroText1} </section>
        <section className={styles.menu_introduction}> {menuIntroText2} </section>
        <section className={styles.menu_introduction}> {menuIntroText3} </section>
        <h2 className={styles.menu_header2}> {t(KEY.sulten_menu_you_are_welcome)} </h2>
        <h1 className={styles.menu_header}> {t(KEY.common_opening_hours)}</h1>
        <section className={styles.opening_hours}>
          <p>
            {' '}
            {t(KEY.common_day_monday)} - {t(KEY.common_day_thursday)}: 16:00 - 23:00{' '}
          </p>
          <p>
            {' '}
            {t(KEY.common_day_friday)} - {t(KEY.common_day_saturday)}: 16:00 - 02:00{' '}
          </p>
          <p> {t(KEY.common_day_sunday)}: 16:00 - 21:00 </p>
        </section>

        {sortedCategories.map((category) => (
          <React.Fragment key={category.id}>
            <LycheMenuDivider title={category.name} />
            {category.items.map((item) => (
              <MenuItem
                key={item.id}
                dishTitle={currentLanguage === 'nb' ? item.name_nb ?? '' : item.name_en ?? ''}
                dishDescription={currentLanguage === 'nb' ? item.description_nb ?? '' : item.description_en ?? ''}
                allergens="" // Not in the seed data
                price={`${item.price_member},- / ${item.price},-`}
              />
            ))}
          </React.Fragment>
        ))}
      </LycheFrame>
    </SultenPage>
  );
}
