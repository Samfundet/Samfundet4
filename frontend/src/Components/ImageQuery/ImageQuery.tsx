import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { SetState } from '~/types';
import { InputField } from '../InputField';
import styles from './ImageQuery.module.scss';
import { imageQuery } from './utils';

type ImageQueryProps = {
  allImages: ImageDto[];
  setImages: SetState<ImageDto[]>;
};

export function ImageQuery({ allImages, setImages }: ImageQueryProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    setImages(imageQuery(allImages, search));
  }, [search, allImages, setImages]);

  const placeholder = `${t(KEY.common_search)} (${allImages.length})`;
  return (
    <div className={styles.queryBar}>
      <InputField onChange={setSearch} icon="mdi:search" placeholder={placeholder} className={styles.element} />
    </div>
  );
}
