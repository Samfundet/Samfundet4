import classnames from 'classnames';
import styles from './Dropdown.module.scss';

type DropdownProps = {
  className?: string;
  wrapper?: string;
  default_value?: string;
  options?: string[];
  label?: string;
  onChange?: (e?: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function Dropdown({ options, wrapper, default_value, onChange, className, label }: DropdownProps) {
  const classNames = classnames(className);
  return (
    <label className={classnames(styles.select_wrapper, wrapper)}>
      {label}
      <select className={styles.samf_select} onChange={onChange}>
        {default_value && (
          <option value="" className={classNames}>
            {default_value}
          </option>
        )}
        {options?.map(function (element, index) {
          return (
            <option value={element[0]} key={index} className={classNames}>
              {element[element.length - 1]}
            </option>
          );
        })}
      </select>
      <span className={styles.custom_select_arrow}>&#9660;</span>
      {/* span inneholder "nedover pil" symbol */}
    </label>
  );
}
