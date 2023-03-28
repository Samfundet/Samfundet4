import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { getInformationPage, putInformationPage } from '~/api';
import { Button, InputField, RadioButton, SamfundetLogoSpinner } from '~/Components';
import { InformationPageDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY, KeyValues, LANGUAGES, LanguageValue } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

import styles from './InformationFormPage.module.scss';

/**
 * Maps language to known suffix of fields in InformationPageDto.
 * Needed to select which field to edit based on current selected language.
 */
const LANG_TO_SUFFIX: Record<LanguageValue, string> = {
  [LANGUAGES.NB]: '_nb',
  [LANGUAGES.EN]: '_en',
} as const;

/** Map Language to their translation key (name) */
const LANG_KEY: Record<LanguageValue, KeyValues> = {
  [LANGUAGES.NB]: KEY.norwegian,
  [LANGUAGES.EN]: KEY.english,
} as const;

type PageFieldName = keyof InformationPageDto;

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function InformationFormPage() {
  const [originalPage, setOriginalPage] = useState<InformationPageDto>();
  const [page, setPage] = useState<InformationPageDto>();
  const [showOriginal, setShowOriginal] = useState(false);
  const [language, setLanguage] = useState<LanguageValue>(LANGUAGES.NB);
  const { t } = useTranslation();
  const { slugField } = useParams();
  const navigate = useNavigate();

  /** Find field suffix given language. */
  const currentSuffix = LANG_TO_SUFFIX[language];

  /** Find which page to display of draft and original. */
  const currentPage = showOriginal ? originalPage : page;

  // Find fieldnames to edit on page.
  const currentTitleFieldName = ('title' + currentSuffix) as PageFieldName;
  const currentTextFieldName = ('text' + currentSuffix) as PageFieldName;

  /** Makes sure only a single language can be selected simultaniously. */
  const languageRadioGroupName = 'language-selection';

  const btnShowOriginalTextKey = showOriginal
    ? KEY.information_form_page__show_draft
    : KEY.information_form_page__show_original;

  // Stuff to do on first render.
  useEffect(() => {
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          setPage(data);
          setOriginalPage(data);
        })
        .catch(console.error);
    }
  }, [slugField]);

  /** Given field, update that field on state page. */
  function handleChange(value: string, fieldname: PageFieldName) {
    const updatedInformationPage = { ...page, [fieldname]: value } as InformationPageDto;
    setPage(updatedInformationPage);
  }

  function handleSave() {
    if (page) {
      putInformationPage(page.slug_field, page).then((response) => {
        if (response.status === STATUS.HTTP_200_OK) {
          navigate(
            reverse({ pattern: ROUTES.frontend.information_page_detail, urlParams: { slugField: page.slug_field } }),
          );
        }
      });
    }
  }

  // Guard undefined page.
  if (!currentPage) {
    return <SamfundetLogoSpinner />;
  }

  return (
    <div className={styles.wrapper}>
      <div>
        {Object.values(LANGUAGES).map((lang, i) => {
          return (
            <RadioButton
              key={i}
              defaultChecked={lang === language}
              name={languageRadioGroupName}
              onChange={() => setLanguage(lang)}
            >
              {t(LANG_KEY[lang])}
            </RadioButton>
          );
        })}
      </div>
      <Button theme={showOriginal ? 'secondary' : 'samf'} onClick={() => setShowOriginal(!showOriginal)}>
        {t(btnShowOriginalTextKey)}
      </Button>

      <div className={styles.row}>
        <h2 className={styles.col}>{t(KEY.common_edit)}:</h2>
        <h2 className={styles.col}>{t(KEY.information_form_page__preview)}:</h2>
      </div>

      {/* Title */}
      <div className={styles.row}>
        <InputField<string>
          labelClassName={styles.col}
          type="text"
          disabled={showOriginal}
          value={currentPage[currentTitleFieldName]}
          onChange={(txt) => handleChange(txt, currentTitleFieldName)}
        >
          {t(KEY.common_title, { lng: language })}:
        </InputField>
        <h1 className={styles.col}>{currentPage[currentTitleFieldName]}</h1>
      </div>

      {/* Text */}
      <div className={styles.row}>
        <label className={styles.col}>
          {t(KEY.common_text)}:
          <textarea
            disabled={showOriginal}
            className="w-100 h-100"
            name={currentTextFieldName}
            value={currentPage[currentTextFieldName]}
            onChange={(e) => handleChange(e?.currentTarget.value, currentTextFieldName)}
          />
        </label>
        <ReactMarkdown className={styles.col}>{currentPage[currentTextFieldName] || ''}</ReactMarkdown>
      </div>
      <Button className={styles.btn_save} onClick={handleSave}>
        {t(KEY.common_save)}
      </Button>
    </div>
  );
}
