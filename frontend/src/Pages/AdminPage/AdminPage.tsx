import { useEffect, useState } from 'react';
import { hasPerm } from '~/utils';
import { Button, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { applets } from './applets';
import styles from './AdminPage.module.scss';
import { AdminBox } from '~/Components/AdminBox';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */

const WISEWORDS = [
  'En reke om dagen er godt for magen.',
  'Hiv, og hoi! Snart er skatten vår!',
  'Langemann lurer alle, som en ulv i fåreklær!',
  'Vi jobber best når det dundrer og smeller rundt skuta vår!',
  'Kan du danse som en reke?',
  'Bli med til rekeland!',
  'Alle sjødyr er velkommen i rekeland!',
  'Lykken er et saftig rekesmørbrød.',
  'Bli med ut for å reke!',
  'Som du roper i skogen får du svar!',
  'Ekte reker lever på land.',
  'Har du noen gang sett en reke svømme 3000 meter?',
  'Reker trenger alltid ny rogn.',
  'Noen reker har aldri på seg t-skjorte.',
  'Reker elsker alle dyr i sjøen! <3',
  'Si hei til en reke!',
  'Hvilket sjødyr er du? En krabbe kanskje?',
  'Hvilket sjødyr er du? En blekksprut kanskje?',
  'Store fisker spiser aldri små fisker.',
  'Hopp i havet!',
  'Selv om sjødyr vokser opp til slutt blir de aldri glemt.',
  'En sprellende fisk burde få creds for å i hvertfall prøve å danse.',
  'Ville ha en reke som kjæledyr, men reker er frie dyr.',
  'Ikke alle pensjonister har skjegg faktisk.',
  'Adopter en reke i dag!',
  'Hvordan bruker egentlig en reke et tegnebrett?',
  'Reker ser alltid på film på søndager.',
  'Blub, blub!',
  'Jeg husker enda da jeg var rogn.',
  'Reker er flinke til å skrive!',
  'Reker er sjøens influencere.',
];

export function AdminPage() {
  const { user } = useAuthContext();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  useEffect(() => {
    setShowSpinner(false);
  }, [user]);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <div className={styles.header}>
        <h1 className={styles.headerText}>{t(KEY.control_panel_title)}</h1>
        <p className={styles.wisewords}>{WISEWORDS[Math.floor(Math.random() * WISEWORDS.length)]}</p>
        <Button theme="outlined" className={styles.faq_button}>
          <p className={styles.faq_text}>{t(KEY.control_panel_faq)}</p>
        </Button>
      </div>
      <div className={styles.applets}>
        {applets.map(function (element, key) {
          if (element.perm == null || hasPerm({ user: user, permission: element.perm })) {
            return <AdminBox key={key} title={element.title} options={element.options} />;
          }
        })}
      </div>
    </Page>
  );
}
