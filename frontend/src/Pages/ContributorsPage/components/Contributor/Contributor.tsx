import styles from '~/Pages/ContributorsPage/ContributorsPage.module.scss';
import { KEY } from '~/i18n/constants';
import { Icon } from '@iconify/react';
import { Link } from '~/Components';
import { useTranslation } from 'react-i18next';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import lightAvatar from '~/assets/contributors/default.svg';
import darkAvatar from '~/assets/contributors/default_dark.svg';
import { THEME } from '~/constants';

export type Contributor = {
  name: string;
  from: string;
  to?: string;
  github?: string;
  picture?: string;
  websjef?: {
    from: string;
    to: string;
  };
};

type Props = {
  contributor: Contributor;
};

export function ContributorItem({ contributor }: Props) {
  const { t } = useTranslation();
  const { theme } = useGlobalContext();

  const defaultAvatar = theme === THEME.DARK ? darkAvatar : lightAvatar;

  return (
    <div key={contributor.name} className={styles.contributor}>
      <img src={contributor.picture || defaultAvatar} className={styles.avatar} alt={`${contributor.name} avatar`} />
      <div className={styles.info}>{contributor.name}</div>
      <span className={styles.active_period}>
        ({t(KEY.common_active).toLowerCase()} {contributor.from}&ndash;
        {contributor.to ? contributor.to : t(KEY.common_now).toLowerCase()})
      </span>
      <div className={styles.info}>
        {contributor.websjef && (
          <span className={styles.websjef_icon} title={`Websjef ${contributor.websjef.from}-${contributor.websjef.to}`}>
            <Icon icon="mdi:account-tie" />
          </span>
        )}
        {contributor.github && (
          <Link url={`https://github.com/${contributor.github}`}>
            <Icon icon="mdi:github" />
          </Link>
        )}
      </div>
    </div>
  );
}
