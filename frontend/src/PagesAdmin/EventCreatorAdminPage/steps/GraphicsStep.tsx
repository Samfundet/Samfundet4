import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/Components';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { KEY } from '~/i18n/constants';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

export function GraphicsStep({ form }: { form: UseFormReturn<FormType> }) {
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name="image"
      key={'image'}
      render={({ field }) => (
        <FormItem className={styles.form_item}>
          <FormLabel>{t(KEY.common_image)}</FormLabel>
          <FormControl>
            <ImagePicker
              onSelected={(image) => {
                field.onChange(image);
              }}
              selectedImage={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
