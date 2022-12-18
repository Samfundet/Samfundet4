import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, InputField, SamfundetLogoSpinner, Select } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './GangsFormAdminPage.module.scss';
import ReactMarkdown from 'react-markdown';
import { getGang, getGangList, postGang, putGang, getInformationPages } from '~/api';
import { STATUS } from '~/http_status_codes';
import { reverse } from '~/named-urls';

export function GangsFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const [nameNo, setNameNo] = useState({ value: '', error: '' });
  const [nameEn, setNameEn] = useState({ value: '', error: '' });
  const [abbreviation, setAbbreviation] = useState({ value: '', error: '' });
  const [webpage, setWebpage] = useState({ value: '', error: '' });

  const [gangType, setGangType] = useState({ value: '', error: '' });
  const [gangTypeOptions, setGangTypeOptions] = useState([]);
  const [infoPage, setInfoPage] = useState({ value: '', error: '' });
  const [infoPageOptions, setInfoPageOptions] = useState([]);

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  useEffect(() => {
    // TODO add fix on no id on editpage
    getGangList().then((data) => {
      setGangTypeOptions(
        [['', '']].concat(
          data.map(function (element, index) {
            return [element.id, element.title_no];
          }),
        ),
      );
    });
    getInformationPages().then((data) => {
      setInfoPageOptions(
        [['', '']].concat(
          data.map(function (element, index) {
            return [element.slug_field, element.slug_field];
          }),
        ),
      );
    });
    if (id) {
      getGang(id)
        .then((data) => {
          console.log(data.name_no);
          setNameNo({ value: data.name_no, error: '' });
          setNameEn({ value: data.name_en, error: '' });
          setAbbreviation({ value: data.abbreviation, error: '' });
          setWebpage({ value: data.webpage, error: '' });
          setGangType({ value: data.gang_type, error: '' });
          setInfoPage({ value: data.info_page, error: '' });
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_gangs);
          }
        });
    }
    setShowSpinner(false);
  }, []);

  useEffect(() => {
    console.log(nameNo);
  },[nameNo]);
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function post(event: SyntheticEvent) {
    event.preventDefault();
    const data = {
      name_no: nameNo.value,
      name_en: nameEn.value,
      abbreviation: abbreviation.value,
      webpage: webpage.value,
      gang_type: gangType.value,
      info_page: infoPage.value,
    };
    if (id) {
      data.id = id;
      putGang(data)
        .then((status) => {
          navigate(ROUTES.frontend.admin_gangs);
        })
        .catch((e) => {
          console.error(e.response);
        });
    } else {
      postGang(data)
        .then((status) => {
          navigate(ROUTES.frontend.admin_gangs);
        })
        .catch((e) => {
          console.error(e.response);
          if ('name_no' in e.response.data) {
            setNameNo({ value: nameNo.value, error: e.response.data.name_no });
          }
          if ('name_en' in e.response.data) {
            setNameEn({ value: nameEn.value, error: e.response.data.name_en });
          }
          if ('abbreviation' in e.response.data) {
            setAbbreviation({ value: abbreviation.value, error: e.response.data.abbreviation });
          }
          if ('webpage' in e.response.data) {
            setWebpage({ value: webpage.value, error: e.response.data.webpage });
          }
          if ('gang_type' in e.response.data) {
            setGangType({ value: gangType.value, error: e.response.data.gang_type });
          }
          if ('info_page' in e.response.data) {
            setInfoPage({ value: infoPage.value, error: e.response.data.info_page });
          }
        });
    }
  }

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_gangs)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.gang)}
      </h1>
      <form onSubmit={post}>
        <InputField
          className={styles.input}
          value={nameNo.value}
          error={nameNo.error}
          onChange={(e) => setNameNo({ value: e ? e.currentTarget.value : '', error: '' })}
        >
          <p className={styles.labelText}>
            {t(KEY.norwegian)} {t(KEY.name)}
          </p>
        </InputField>
        <InputField
          className={styles.input}
          value={nameEn.value}
          error={nameEn.error}
          onChange={(e) => setNameEn({ value: e ? e.currentTarget.value : '', error: '' })}
        >
          <p className={styles.labelText}>
            {t(KEY.english)} {t(KEY.name)}
          </p>
        </InputField>
        <InputField
          className={styles.input}
          value={abbreviation.value}
          error={abbreviation.error}
          onChange={(e) => setAbbreviation({ value: e ? e.currentTarget.value : '', error: '' })}
        >
          <p className={styles.labelText}>{t(KEY.abbreviation)}</p>
        </InputField>
        <InputField
          className={styles.input}
          value={webpage.value}
          error={webpage.error}
          onChange={(e) => setWebpage({ value: e ? e.currentTarget.value : '', error: '' })}
        >
          <p className={styles.labelText}>{t(KEY.webpage)}</p>
        </InputField>
        <Select
          className={styles.input}
          onChange={(e) => setGangType({ value: e ? e.currentTarget.value : '', error: '' })}
          error={gangType.error}
          value={gangType.value}
          options={gangTypeOptions}
        >
          <p className={styles.labelText}>{t(KEY.gang_type)}</p>{' '}
        </Select>
        <Select
          className={styles.input}
          onChange={(e) => setInfoPage({ value: e ? e.currentTarget.value : '', error: '' })}
          error={infoPage.error}
          value={infoPage.value}
          options={infoPageOptions}
        >
          <p className={styles.labelText}>{t(KEY.information_page)}</p>{' '}
        </Select>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {id ? t(KEY.common_save) : t(KEY.common_create)} {t(KEY.gang)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}
