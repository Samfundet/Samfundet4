import { useTranslation } from 'react-i18next';
import { Page } from '~/Components';
import robines from '~/assets/contributors/robines.jpg';
import snorre98 from '~/assets/contributors/snorre98.jpg';
import { KEY } from '~/i18n/constants';
import styles from './ContributorsPage.module.scss';
import { type Contributor, ContributorItem } from './components';

// biome-ignore format: array should not be formatted
const CONTRIBUTORS: Contributor[] = [
  // H17
  { name: 'Kevin Kristiansen', github: 'KevinKristiansen', from: 'H17', to: 'V20', websjef: { from: 'V18', to: 'H18' } },
  // H19
  { name: 'Emil Telstad', github: 'emilte', from: 'H19' },
  { name: 'Sigve Røkenes', github: 'evgiz', from: 'H19', to: 'H23', websjef: { from: 'H20', to: 'V21' } },
  // V20
  { name: 'Marcus Frenje', github: 'Frenje123', from: 'V20' },
  // H20
  { name: 'Magnus Øvre Sygard', github: 'magsyg', from: 'H20' },
  { name: 'Snorre Skjellestad Kristiansen', github: 'snorrekr', from: 'H20', websjef: { from: 'H21', to: 'V22' } },
  // V21
  { name: 'Johanne Dybevik', github: 'JohanneD', from: 'V21', to: 'V24' },
  // H21
  { name: 'Mathias Aas', github: 'Mathias-a', from: 'H21', websjef: { from: 'H22', to: 'V23' } },
  // V22
  { name: 'Sindre Lothe', github: 'sindrelothe', from: 'V22', to: 'H23' },
  // H22
  { name: 'Snorre Sæther', github: 'Snorre98', from: 'H22', picture: snorre98, websjef: { from: 'H24', to: 'V25' } },
  { name: 'Eirik Hoem', github: 'eiriksho', from: 'H22', to: 'V23' },
  { name: 'Simen Seeberg-Rommetveit', github: 'simensee', from: 'H22' },
  // V23
  { name: 'Robin Espinosa Jelle', github: 'robines', from: 'V23', picture: robines, websjef: { from: 'H23', to: 'V24' } },
  { name: 'Johanne Grønlien Gjedrem', github: 'johannegg', from: 'V23' },
  { name: 'Tinius Presterud', github: 'tiniuspre', from: 'V23' },
  // H23
  { name: 'Amalie Johansen Vik', github: 'amaliejvik', from: 'H23' },
  { name: 'Marion Lystad', github: 'marionlys', from: 'H23' },
  { name: 'Heidi Herfindal Rasmussen', github: 'hei98', from: 'H23' },
  { name: 'Erik Hoff', github: 'aTrueYety', from: 'H23' },
  // V24
  { name: 'Emil Solberg', github: 'emsoraffa', from: 'H24' },
];

export function ContributorsPage() {
  const { t } = useTranslation();

  const activeContributors = CONTRIBUTORS.filter((c) => !c.to);
  const inactiveContributors = CONTRIBUTORS.filter((c) => !!c.to);

  return (
    <Page className={styles.container}>
      <h1 className={styles.header}>{t(KEY.contributors_page_title)}</h1>
      <p>{t(KEY.contributors_page_text)}</p>

      <div className={styles.contributors}>
        {activeContributors.map((c) => (
          <ContributorItem key={c.name} contributor={c} />
        ))}
      </div>

      <h1 className={styles.header}>{t(KEY.contributors_page_past_developers)}</h1>
      <div className={styles.contributors}>
        {inactiveContributors.map((c) => (
          <ContributorItem key={c.name} contributor={c} />
        ))}
      </div>
      <div />
    </Page>
  );
}
