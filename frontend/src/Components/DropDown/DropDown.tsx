import classnames from 'classnames';
import styles from './DropDown.module.scss';

type DropDownProps = {
  className?: string;
  option?: string[];
  label?: string;
};

export function DropDown({ option, className, label }: DropDownProps) {
  const classNames = classnames(className);
  return (
    <label className={styles.select_wrapper}>
      {label}
      <select className={styles.samf_select}>
        {option?.map(function (element, index) {
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
