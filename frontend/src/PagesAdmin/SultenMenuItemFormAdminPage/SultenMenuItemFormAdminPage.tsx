import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getFoodCategories, getFoodPreferences, getMenuItem, postMenuItem, putMenuItem } from '~/api';
import { FoodCategoryDto, FoodPreferenceDto, MenuItemDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './SultenMenuItemFormAdminPage.module.scss';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

type FormType = {
  name_nb: string;
  name_en: string;

  description_nb: string;
  description_en: string;

  price: number;
  price_member: number;

  food_preferences: number[];
  food_category: number;
};

export function SultenMenuItemFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [menuItem, setMenuItem] = useState<Partial<MenuItemDto>>({});
  const [foodPreferenceOptions, setFoodPreferenceOptions] = useState<DropDownOption<number>[]>([]);
  const [foodCategoryOptions, setFoodCategoryOptions] = useState<DropDownOption<number>[]>([]);

  const initialData: Partial<FormType> = {
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
  const title = (id ? t(KEY.common_edit) : t(KEY.common_create)) + ' ' + lowerCapitalize(`${t(KEY.sulten_dishes)}`);

  // Fetch data if edit mode.

  useEffect(() => {
    Promise.all([
      getFoodCategories()
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
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
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
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        }),
    ]);
  }, [t]);

  useEffect(() => {
    if (id) {
      getMenuItem(id)
        .then((data) => {
          setMenuItem(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_sulten_menu);
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Guards.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: FormType) {
    if (data.food_preferences) {
      data.food_preferences = []; // TODO Ignore until multiselect is added
    }
    if (id) {
      // Update page.
      putMenuItem(id, data as MenuItemDto)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_sulten_menu,
            }),
          );
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
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
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <SamfForm<FormType> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
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
            type="text_long"
            label={t(KEY.common_description) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="description_en"
            type="text_long"
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
