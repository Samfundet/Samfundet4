import { Link, Text } from '~/Components';
import styles from './ExternalHostBox.module.scss';

type ExternalHostBoxProps = {
  host: string;
  host_link: string;
};

export function ExternalHostBox({ host, host_link }: ExternalHostBoxProps) {
  return (
    <div className={styles.external_host_box_wrapper}>
      <Text>
        Arrangeres i regi av ekstern arrangør, ikke gjengene på Samfundet. Henvendelser kan rettes mot:
        <Link className={styles.external_host_link} target={'external'} url={host_link}>
          {host}
        </Link>
      </Text>
    </div>
  );
}
