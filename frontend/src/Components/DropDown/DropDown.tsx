import classnames from 'classnames';
import styles from './DropDown.module.scss';

// type DropDownTheme = 'samf' | 'secondary';
type Alignment = 'top' | 'bottom';

type DropDownProps = {
  className?: string;
  dropDownList?: Array<string>;
  label?: string;
  alignment?: Alignment;
  //   theme?: DropDownTheme;
};

// const mapThemeToStyle: { [theme in DropDownTheme]: string } = {
//   samf: styles.dropdown_samf,
//   secondary: styles.dropdown_secondary,
// };
export function DropDown({ dropDownList, className, alignment = 'top', label }: DropDownProps) {
  //theme = 'samf'
  const classNames = classnames(className); //mapThemeToStyle[theme],
  return (
    <label className={styles.select_wrapper}>
      {alignment == 'top' && label}
      <select className={styles.samf_select}>
        {dropDownList?.map(function (element, index) {
          return (
            <option value={element} key={index} className={classNames}>
              {element}
            </option>
          );
        })}
      </select>
      <span className={styles.custom_select_arrow}></span>
      {alignment == 'bottom' && label}
    </label>
  );
}
