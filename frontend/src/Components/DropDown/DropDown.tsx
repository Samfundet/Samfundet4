import classnames from 'classnames';
import styles from './DropDown.module.scss';

type DropDownTheme = 'samf' | 'secondary';

type DropDownProps = {
  className?: string;
  dropDownList?: Array<string>;
  theme?: DropDownTheme;
};
const mapThemeToStyle: { [theme in DropDownTheme]: string } = {
  samf: styles.dropdown_samf,
  secondary: styles.dropdown_secondary,
};
export function DropDown({ dropDownList, theme = 'samf', className }: DropDownProps) {
  const classNames = classnames(mapThemeToStyle[theme], className);
  return (
    <select>
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
