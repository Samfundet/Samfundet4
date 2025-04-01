import { useTranslation } from 'react-i18next';
import { Link, Text } from '~/Components';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './ExternalHostBox.module.scss';

type ExternalHostBoxProps = {
  host: string;
  host_link: string;
};

export function ExternalHostBox({ host, host_link }: ExternalHostBoxProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.external_host_box_wrapper}>
      <Text>
        {`${t(KEY.event_external_host_message)}: `}{' '}
        <Link
          style={{ color: COLORS.white, textDecoration: `underline ${COLORS.white}` }}
          target={'external'}
          url={host_link}
        >
          {host}
        </Link>
      </Text>
    </div>
  );
}
