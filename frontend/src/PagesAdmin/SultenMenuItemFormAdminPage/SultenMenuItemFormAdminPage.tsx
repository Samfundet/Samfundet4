import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getFoodCategorys, getFoodPreferences, getMenuItem, postMenuItem, putMenuItem } from '~/api';
import { FoodCategoryDto, FoodPreferenceDto, MenuItemDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SultenMenuItemFormAdminPage.module.scss';

export function SultenMenuItemFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [menuItem, setMenuItem] = useState<Partial<MenuItemDto>>({});
  const [foodPreferenceOptions, setFoodPreferenceOptions] = useState<DropDownOption<number>[]>([]);
  const [foodCategoryOptions, setFoodCategoryOptions] = useState<DropDownOption<number>[]>([]);
  // Fetch data if edit mode.

  useEffect(() => {
    Promise.all([
      getFoodCategorys()
        .then((data) => {
          setFoodCategoryOptions(
            data.map(
              (category: FoodCategoryDto) =>
                ({
                  label: dbT(category, 'name'),
                  value: category.id,
                }) as DropDownOption<number>,
            ),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
      getFoodPreferences()
        .then((data) => {
          setFoodPreferenceOptions(
            data.map(
              (preference: FoodPreferenceDto) =>
                ({
                  label: dbT(preference, 'name'),
                  value: preference.id,
                }) as DropDownOption<number>,
            ),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getMenuItem(id)
        .then((data) => {
          setMenuItem(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_recruitment);
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    } else {
      setShowSpinner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initialData: Partial<MenuItemDto> = {
    name_nb: menuItem?.name_nb,
    name_en: menuItem?.name_en,

    description_nb: menuItem?.description_nb,
    description_en: menuItem?.description_en,

    price: menuItem?.price,
    price_member: menuItem?.price_member,

    food_preferences: [], // TODO add on multiselect
    food_category: (menuItem?.food_category as FoodCategoryDto)?.id,
  };

  const submitText = id ? t(KEY.common_save) : t(KEY.common_create);

  // Loading.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: MenuItemDto) {
    if (data.food_preferences) {
      data.food_preferences = []; // TODO Ignore until multiselect is added
    }
    if (id) {
      // Update page.
      putMenuItem(id, data)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_sulten_menu,
            }),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    } else {
      // Post new page.
      postMenuItem(data)
        .then(() => {
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_sulten_menu,
            }),
          );
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }

  const title = (id ? t(KEY.common_edit) : t(KEY.common_create)) + ' ' + lowerCapitalize(`${t(KEY.sulten_dishes)}`);

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <SamfForm<MenuItemDto> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField
            field="name_nb"
            required={true}
            type="text"
            label={t(KEY.common_name) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="name_en"
            required={true}
            type="text"
            label={t(KEY.common_name) + ' ' + t(KEY.common_english)}
          />
        </div>

        <div className={styles.row}>
          <SamfFormField
            field="description_nb"
            type="text-long"
            label={t(KEY.common_description) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="description_en"
            type="text-long"
            label={t(KEY.common_description) + ' ' + t(KEY.common_english)}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField field="price" required={true} type="number" label={t(KEY.common_price)} />
          <SamfFormField
            field="price_member"
            required={true}
            type="number"
            label={t(KEY.common_price) + ' ' + t(KEY.common_member)}
          />
          <SamfFormField
            field="food_category"
            required={true}
            type="options"
            label={t(KEY.category)}
            options={foodCategoryOptions}
          />
          <SamfFormField
            field="food_preferences"
            type="options"
            label={t(KEY.common_food) + ' ' + t(KEY.common_preferences)}
            options={foodPreferenceOptions}
          />
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}
