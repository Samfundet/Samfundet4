import { Icon } from '@iconify/react';
import type { DirectiveEditorProps } from '@mdxeditor/editor';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '~/Components';
import { getImage } from '~/api';
import { imageKeys } from '~/domain';
import { KEY } from '~/i18n/constants';
import { imageUrl } from '~/utils';
import { useSamfImageDialog } from './SamfImageDialogProvider';
import styles from './SamfImageEditor.module.scss';
import { readImageDirective, writeImageDirective } from './directive';

/** Renders an `::image{id=...}` directive inside the editor */
export function SamfImageEditor({ mdastNode, lexicalNode, parentEditor }: DirectiveEditorProps) {
  const { t } = useTranslation();
  const { imageId, alt } = readImageDirective(mdastNode);
  const openDialog = useSamfImageDialog();

  const { data: image, isPending } = useQuery({
    queryKey: imageKeys.detail(imageId),
    queryFn: () => getImage(imageId),
    enabled: !Number.isNaN(imageId),
  });

  function edit() {
    openDialog({
      imageId: Number.isNaN(imageId) ? undefined : imageId,
      alt,
      onSubmit: (attributes) => {
        parentEditor.update(() => {
          lexicalNode.setMdastNode({
            ...mdastNode,
            attributes: writeImageDirective(attributes),
          });
        });
      },
    });
  }

  function remove() {
    parentEditor.update(() => {
      lexicalNode.selectNext();
      lexicalNode.remove();
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.toolbar_button} title={t(KEY.common_edit)} onClick={edit}>
          <Icon icon="mdi:pencil" />
        </button>
        <button type="button" className={styles.toolbar_button} title={t(KEY.common_delete)} onClick={remove}>
          <Icon icon="mdi:bin" />
        </button>
      </div>

      {isPending && !Number.isNaN(imageId) ? (
        <Skeleton className={styles.skeleton} />
      ) : image ? (
        <>
          <img className={styles.image} src={imageUrl(image, 'small')} alt={alt || image.title} />
          <p className={styles.caption}>{alt || image.title}</p>
        </>
      ) : (
        // The public page silently drops these, so the author is the only one who can notice
        <p className={styles.missing}>
          <Icon icon="mdi:image-broken-variant" />
          {`${t(KEY.admin_markdown_image_not_found)} (#${mdastNode.attributes?.id ?? '?'})`}
        </p>
      )}
    </div>
  );
}
