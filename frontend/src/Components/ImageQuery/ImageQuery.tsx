import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { SetState } from '~/types';
import { queryDtoCustom } from '~/utils';
import { InputField } from '../InputField';
import styles from './ImageQuery.module.scss';

type ImageQueryProps = {
  allImages: ImageDto[];
  setImages: SetState<ImageDto[]>;
};

export function ImageQuery({ allImages, setImages }: ImageQueryProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');

  // Debounce
  const searchRef = useRef<string>(search);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setImages(queryDtoCustom(search, allImages, stringRepresentation));
  }, [search, allImages, setImages]);

  // String representation for searching
  function stringRepresentation(image: ImageDto) {
    // Combine tags into one string
    const tagString = image.tags.reduce((acc, tag) => `${acc} ${tag.name}`, '');
    const representation = `${tagString} ${image.title}`.toLowerCase();
    return representation;
  }

  // Debounced update to prevent lag on continuous filter
  function handleSearchChanged(query: string) {
    searchRef.current = query;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setSearch(searchRef.current);
    }, 200);
  }

  const placeholder = `${t(KEY.common_search)} (${allImages.length})`;
  return (
    <div className={styles.queryBar}>
      <InputField
        onChange={handleSearchChanged}
        icon="mdi:search"
        placeholder={placeholder}
        labelClassName={styles.element}
      />
    </div>
  );
}
