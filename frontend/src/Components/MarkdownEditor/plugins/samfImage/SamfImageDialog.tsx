import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ImageForm, Input, type Tab, TabBar } from '~/Components';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { getImage } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { imageKeys } from '~/domain';
import type { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { hasPermissions } from '~/utils';
import styles from './SamfImageDialog.module.scss';
import type { ImageDirectiveAttributes } from './directive';

type Props = {
  imageId?: number; // pre-selected image
  alt?: string;
  onSubmit(attributes: ImageDirectiveAttributes): void;
  onCancel(): void;
};

type TabKey = 'existing' | 'upload';

// TODO: this is a somewhat gruesome component UX-wise. We should somehow combine existing/upload instead.
export function SamfImageDialog({ imageId, alt: initialAlt = '', onSubmit, onCancel }: Props) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [selected, setSelected] = useState<ImageDto | undefined>();
  const [alt, setAlt] = useState<string>(initialAlt);

  const canUpload = hasPermissions(user, [PERM.SAMFUNDET_ADD_IMAGE], undefined, true);

  const { data: preselected } = useQuery({
    queryKey: imageKeys.detail(imageId as number),
    queryFn: () => getImage(imageId as number),
    enabled: imageId !== undefined,
  });

  const tabs: Tab<TabKey>[] = useMemo(() => {
    const existing: Tab<TabKey> = {
      key: 'existing',
      label: t(KEY.admin_markdown_image_choose_existing),
      value: 'existing',
    };
    if (!canUpload) {
      return [existing];
    }
    return [existing, { key: 'upload', label: t(KEY.admin_markdown_image_upload_new), value: 'upload' }];
  }, [t, canUpload]);

  const [tab, setTab] = useState<Tab<TabKey>>(tabs[0]);

  const image = selected ?? preselected;

  return (
    <div className={styles.container}>
      {tabs.length > 1 && <TabBar tabs={tabs} selected={tab} onSetTab={setTab} spaceAround />}

      {tab.value === 'upload' ? (
        <ImageForm onCreated={(createdImg) => onSubmit({ imageId: createdImg.id, alt })} />
      ) : (
        <>
          <ImagePicker selectedImage={preselected} onSelected={setSelected} />

          <div className={styles.alt_field}>
            <label className={styles.alt_label} htmlFor="samf-image-alt">
              {t(KEY.admin_markdown_image_alt_text)}
            </label>
            <p className={styles.alt_description}>{t(KEY.admin_markdown_image_alt_text_description)}</p>
            <Input id="samf-image-alt" type="text" value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>

          <div className={styles.action_row}>
            <Button type="button" theme="secondary" onClick={onCancel}>
              {t(KEY.common_cancel)}
            </Button>
            <Button
              type="button"
              theme="primary"
              disabled={image === undefined}
              onClick={() => image && onSubmit({ imageId: image.id, alt })}
            >
              {t(KEY.admin_markdown_image_insert)}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
