import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { type Tab, TabBar } from '~/Components/TabBar/TabBar';
import { getInformationPage, postInformationPage, putInformationPage } from '~/api';
import type { InformationPageDto } from '~/dto';
import { useCustomNavigate, useDesktop, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InformationFormAdminPage.module.scss';

export function InformationFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const isDesktop = useDesktop();

  const languageTabs: Tab[] = [
    { key: 'nb', label: 'Norsk' },
    { key: 'en', label: 'Engelsk' },
  ];

  // Form data
  const { slugField } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [infoPage, setInfoPage] = useState<Partial<InformationPageDto>>({
    title_nb: 'Ny informasjonsside',
    text_nb: 'Skriv inn tekst på venstre side.',
    title_en: 'New information page',
    text_en: 'Write your text on the left side.',
  });
  const [languageTab, setLanguageTab] = useState<Tab>(languageTabs[0]);
  const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);
  const showPreview = isDesktop || showMobilePreview;
  const showEditer = isDesktop || !showMobilePreview;

  //Title setup
  const title = slugField
    ? `${t(KEY.common_edit)} ${t(KEY.information_page)}`
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.information_page_short)}`);
  useTitle(title);

  // Fetch data if edit mode.
  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          setInfoPage(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_information, replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [slugField]);

  // Handles changes of text area.
  function handleTextAreaChange(field: string) {
    return (e?: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e?.currentTarget.value ?? '';
      setInfoPage({
        ...infoPage,
        [field]: value,
      });
    };
  }

  // Handles changes of slug field/title.
  function handleTextFieldChange(field: string) {
    return (e?: ChangeEvent<HTMLInputElement>) => {
      const value = e?.currentTarget.value ?? '';
      setInfoPage({
        ...infoPage,
        [field]: value,
      });
    };
  }

  function handleOnSubmit() {
    if (slugField) {
      // Update page.
      putInformationPage(slugField, infoPage)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
      navigate({ url: ROUTES.frontend.admin_information });
    } else {
      // Post new page.
      const slug = infoPage.slug_field ?? '';
      postInformationPage({
        slug_field: slug,
        ...infoPage,
      })
        .then(() => {
          navigate({ url: ROUTES.frontend.admin_information });
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }

  const disableSubmit = (infoPage.slug_field === undefined || infoPage.slug_field === '') && slugField === undefined;
  const text_field = languageTab.key === 'nb' ? 'text_nb' : 'text_en';
  const text_value = languageTab.key === 'nb' ? infoPage.text_nb : infoPage.text_en;

  const title_field = languageTab.key === 'nb' ? 'title_nb' : 'title_en';
  const title_value = languageTab.key === 'nb' ? infoPage.title_nb : infoPage.title_en;

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <div className={styles.wrapper}>
        {/* Language tab */}
        <div className={styles.tab_container}>
          <TabBar tabs={languageTabs} selected={languageTab} onSetTab={setLanguageTab} compact={true} />
        </div>

        {/* Edit fields */}
        <div className={styles.edit_container}>
          {showEditer && (
            <div className={styles.left_side}>
              <input className={styles.title_input} onChange={handleTextFieldChange(title_field)} value={title_value} />
              <textarea className={styles.text_area} onChange={handleTextAreaChange(text_field)} value={text_value} />
            </div>
          )}

          {/* Preview */}
          {showPreview && (
            <div className={styles.preview}>
              <SamfMarkdown>{`# ${title_value} \n ${text_value}`}</SamfMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {/* URL preview */}
          <span className={styles.url_preview}>
            samfundet.no/information-pages/
            {slugField && slugField}
            {!slugField && <input placeholder="samf-url" onChange={handleTextFieldChange('slug_field')} />}
          </span>
          {/* Save button */}
          {!isDesktop && (
            <Button theme="samf" rounded={true} onClick={() => setShowMobilePreview(!showMobilePreview)}>
              Toggle preview
            </Button>
          )}
          <Button theme="green" rounded={true} onClick={handleOnSubmit} disabled={disableSubmit}>
            <div style={{ padding: '0 1em' }}>{t(KEY.common_save)}</div>
          </Button>
        </div>
      </div>
    </AdminPageLayout>
  );
}
