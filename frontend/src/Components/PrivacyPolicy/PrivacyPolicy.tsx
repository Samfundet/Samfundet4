import { useState } from 'react';
import styles from './PrivacyPolicy.module.scss';

export function PrivacyPolicy() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={styles.privacy_policy_container}>
      <input type="checkbox" id="consent" checked={isChecked} onChange={handleCheckboxChange} />
      <label htmlFor="consent" className={styles.label_text}>
        I agree to Samfundet&apos;s privacy policy
      </label>
    </div>
  );
}
