import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTextItem } from '~/api';
import type { TextItemValue } from '~/constants/TextItems';
import type { TextItemDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { LANGUAGES } from '~/i18n/types';

/**
 *  Hook that returns the correct translation for given key
 */
export function useTextItem(key: TextItemValue, language?: string): string {
  const [textItem, setTextItem] = useState<TextItemDto>();
  const { i18n } = useTranslation();
  const isNorwegian = (language || i18n.language) === LANGUAGES.NB;
  useEffect(() => {
    getTextItem(key)
      .then((data) => {
        setTextItem(data);
      })
      .catch((error) => {
        if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
        }
        setTextItem({
          key: 'MISSING_TEXTITEM',
          text_nb: 'ERROR ERROR Manglende tekst, kontakt redaksjon@samfundet.no ERROR ERROR',
          text_en: 'ERROR ERROR Missing text, contact redaksjon@samfundet.no ERROR ERROR',
        });
      });
  }, [key]);
  return isNorwegian ? textItem?.text_nb || '' : textItem?.text_en || '';
}
