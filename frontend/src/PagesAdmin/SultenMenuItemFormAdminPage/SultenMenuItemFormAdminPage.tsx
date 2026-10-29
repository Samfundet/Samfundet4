import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SamfundetLogoSpinner,
  Textarea,
} from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { getFoodCategories, getFoodPreferences, getMenuItem, postMenuItem, putMenuItem } from '~/api';
import { FOOD_CATEGORY, FOOD_PREFERENCES, MENU_ITEM_DESCRIPTION, MENU_ITEM_NAME, MENU_ITEM_PRICE } from '~/domain';
import type { FoodCategoryDto, FoodPreferenceDto, MenuItemDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SultenMenuItemFormAdminPage.module.scss';

const schema = z.object({
  name_nb: MENU_ITEM_NAME,
  name_en: MENU_ITEM_NAME,

  description_nb: MENU_ITEM_DESCRIPTION,
  description_en: MENU_ITEM_DESCRIPTION,

  price: MENU_ITEM_PRICE,
  price_member: MENU_ITEM_PRICE,

  food_preferences: FOOD_PREFERENCES,
  food_category: FOOD_CATEGORY,
});

type FormType = z.infer<typeof schema>;

export function SultenMenuItemFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [foodPreferenceOptions, setFoodPreferenceOptions] = useState<DropdownOption<number>[]>([]);
  const [foodCategoryOptions, setFoodCategoryOptions] = useState<DropdownOption<number>[]>([]);

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: '',
      name_en: '',
      description_nb: '',
      description_en: '',
      price: undefined,
      price_member: undefined,
      food_preferences: [],
      food_category: undefined,
    },
  });

  const submitText = id ? t(KEY.common_save) : t(KEY.common_create);
  const title = `${id ? t(KEY.common_edit) : t(KEY.common_create)} ${lowerCapitalize(`${t(KEY.sulten_dishes)}`)}`;
  useTitle(title);

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
                }) as DropdownOption<number>,
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
                }) as DropdownOption<number>,
            ),
          );
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        }),
    ]);
  }, [t]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (id) {
      getMenuItem(id)
        .then((data) => {
          form.reset({
            name_nb: data.name_nb ?? '',
            name_en: data.name_en ?? '',
            description_nb: data.description_nb ?? '',
            description_en: data.description_en ?? '',
            price: data.price ?? undefined,
            price_member: data.price_member ?? undefined,
            food_preferences: [],
            food_category: (data.food_category as FoodCategoryDto)?.id,
          });
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_sulten_menu, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
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
      <Form {...form} schema={schema}>
        <form className={styles.form} onSubmit={form.handleSubmit(handleOnSubmit)}>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="name_nb"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_norwegian)}`}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_english)}`}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="description_nb"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{`${t(KEY.common_description)} ${t(KEY.common_norwegian)}`}</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{`${t(KEY.common_description)} ${t(KEY.common_english)}`}</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.common_price)}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price_member"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{`${t(KEY.common_price)} ${t(KEY.common_member)}`}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="food_category"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.category)}</FormLabel>
                  <FormControl>
                    <Dropdown
                      options={foodCategoryOptions}
                      nullOption={{ label: t(KEY.common_choose) }}
                      value={field.value ?? null}
                      onChange={(value) => field.onChange(value ?? undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="food_preferences"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{`${t(KEY.common_food)} ${t(KEY.common_preferences)}`}</FormLabel>
                  <FormControl>
                    <Dropdown
                      options={foodPreferenceOptions}
                      nullOption={{ label: t(KEY.common_no) }}
                      value={field.value[0] ?? null}
                      onChange={(value) => field.onChange(value === null ? [] : [value])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.action_row}>
            <Button type="submit" theme="primary">
              {submitText}
            </Button>
          </div>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
