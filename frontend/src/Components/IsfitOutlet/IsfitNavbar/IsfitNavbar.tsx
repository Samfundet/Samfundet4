import { Link } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { IsfitLogo } from '../../Logo/components';
import styles from './IsfitNavbar.module.scss';

export function IsfitNavbar() {
  return (
    <div className={styles.container}>
      {/* TODO: This link should probably take you to a better place */}
      <Link to={ROUTES.frontend.recruitment}>
        <IsfitLogo color="light" size="xsmall" />
      </Link>
    </div>
  );
}
