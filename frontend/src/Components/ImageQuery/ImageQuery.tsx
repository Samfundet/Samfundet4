import { useState, useEffect } from 'react';
import { InputField } from '../InputField';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import styles from './ImageQuery.module.scss';
import { ImageDto } from '~/dto';
import { imageQuery } from './utils';

type ImageQueryProps = {
  allImages: ImageDto[];
  setImages: void;
};

export function ImageQuery({ allImages, setImages }: ImageQueryProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    setImages(imageQuery(allImages, search));
  }, [search, allImages, setImages]);

  return (
    <div className={styles.queryBar}>
      <InputField
        onChange={(e) => setSearch(e ? e.currentTarget.value : '')}
        placeholder={t(KEY.common_search)}
        className={styles.element}
      />
    </div>
  );
}
