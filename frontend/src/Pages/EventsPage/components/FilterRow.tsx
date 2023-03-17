import { EventOptionsChoises_Dto } from '~/dto';
import styles from '~/Pages/EventsPage/EventsPage.module.scss';
import { RadioButton } from '~/Components';
import { KEY } from '~/i18n/constants';
import { Params } from '~/named-urls';
import { useTranslation } from 'react-i18next';

type FilterRowProps = {
  label: string;
  name: string;
  property: EventOptionsChoises_Dto;
  urlArgs: Params;
};

export function FilterRow({ label, name, property, urlArgs }: FilterRowProps) {
  const { t } = useTranslation<string>();

  return (
    <div>
      <div className={styles.colour_label}>
        <label className={styles.center}>{label}</label>
      </div>
      <div className={styles.filterColumn}>
        <label className={styles.container}>
          <RadioButton
            key={label}
            name={label}
            defaultChecked={true}
            value={'all'}
            onChange={() => delete urlArgs[name]}
          />
          {t(KEY.all)}
        </label>
        {Object.keys(property).map((option, key) => (
          <label key={key} className={styles.container}>
            <RadioButton
              key={key}
              name={label}
              value={property[key].value}
              onChange={() => (urlArgs[name] = property[key].value)}
            />
            {property[key].display_name}
          </label>
        ))}
      </div>
    </div>
  );
}
