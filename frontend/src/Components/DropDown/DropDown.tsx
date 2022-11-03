import classnames from 'classnames';
import styles from './DropDown.module.scss';

// type DropDownTheme = 'samf' | 'secondary';

type DropDownProps = {
  className?: string;
  dropDownList?: Array<string>;
  label?: string;

  //   theme?: DropDownTheme;
};

// const mapThemeToStyle: { [theme in DropDownTheme]: string } = {
//   samf: styles.dropdown_samf,
//   secondary: styles.dropdown_secondary,
// };
export function DropDown({ dropDownList, className, label }: DropDownProps) {
  //theme = 'samf'
  const classNames = classnames(className); //mapThemeToStyle[theme],
  return (
    <label className={styles.select_wrapper}>
      {label}
      <select className={styles.samf_select}>
        {dropDownList?.map(function (element, index) {
          return (
            <option value={element} key={index} className={classNames}>
              {element}
            </option>
          );
        })}
      </select>
      <span className={styles.custom_select_arrow}>&#9660;</span>
      {/* span inneholder "nedover pil" symbol */}
    </label>
  );
}
