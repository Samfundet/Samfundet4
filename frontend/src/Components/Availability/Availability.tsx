import classNames from 'classnames';
import { InputField } from '../InputField';
import styles from './Availability.module.scss';
import { Children } from '~/types';

interface AvailabilityProps {

}

interface AvailabilityLineProps {
  start: Date;
  end: Date;
  date: Date;

}

function AvailabilityLine({ }: AvailabilityLineProps) {
  return (
    <div className={styles.availability_line} >

      <InputField minDate={'2023-11-15'} maxDate={'2023-11-20'} type='date' inputClassName={styles.availability_line_field}></InputField>
      <InputField type='time' inputClassName={styles.availability_line_field}></InputField>
      <InputField type='time' inputClassName={styles.availability_line_field}></InputField>
    </div>
  );
}
export function Availability({ }: AvailabilityProps) {
  return (
    <div className={styles.container}>
      <AvailabilityLine />
      <AvailabilityLine />
      <AvailabilityLine />
    </div>
  );
}
