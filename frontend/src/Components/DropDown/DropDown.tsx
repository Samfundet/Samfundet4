import classnames from 'classnames';
import styles from './DropDown.module.scss';

// type DropDownTheme = 'samf' | 'secondary';

type DropDownProps = {
  className?: string;
  dropDownList?: Array<string>;
  //   theme?: DropDownTheme;
};
// const mapThemeToStyle: { [theme in DropDownTheme]: string } = {
//   samf: styles.dropdown_samf,
//   secondary: styles.dropdown_secondary,
// };
export function DropDown({ dropDownList, className }: DropDownProps) {
  //theme = 'samf'
  const classNames = classnames(className); //mapThemeToStyle[theme],
  return (
    <select className={styles.samf_select}>
      {dropDownList?.map(function (element, index) {
        return (
          <option value={element} key={index} className={classNames}>
            {element}
          </option>
        );
      })}
    </select>
  );
}
