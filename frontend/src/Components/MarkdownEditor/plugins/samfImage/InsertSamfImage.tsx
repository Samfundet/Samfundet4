import { Icon } from '@iconify/react';
import { ButtonWithTooltip, insertDirective$, usePublisher } from '@mdxeditor/editor';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { useSamfImageDialog } from './SamfImageDialogProvider';
import { IMAGE_DIRECTIVE_NAME, writeImageDirective } from './directive';

export function InsertSamfImage() {
  const { t } = useTranslation();
  const insertDirective = usePublisher(insertDirective$);
  const openDialog = useSamfImageDialog();

  const title = t(KEY.admin_markdown_insert_image);

  return (
    <ButtonWithTooltip
      title={title}
      aria-label={title}
      onClick={() =>
        openDialog({
          onSubmit: (attributes) =>
            insertDirective({
              type: 'leafDirective',
              name: IMAGE_DIRECTIVE_NAME,
              attributes: writeImageDirective(attributes),
            }),
        })
      }
    >
      <Icon icon="mdi:image-outline" />
    </ButtonWithTooltip>
  );
}
