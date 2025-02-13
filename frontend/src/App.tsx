import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useGoatCounter, useIsDarkTheme } from '~/hooks';

import 'react-toastify/dist/ReactToastify.min.css';

// Neccessary import for translations.
import { CommandMenu, UserFeedback, useScrollToTop } from './Components';
import './i18n/i18n';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

export function App() {
  const goatCounterCode = import.meta.env.VITE_GOATCOUNTER_CODE;
  const isDev = import.meta.env.DEV;
  const localSetup = isDev ? '{"allow_local": true}' : undefined;
  const isDarkTheme = useIsDarkTheme();

  // Make form error messages automatically translate
  const { t } = useTranslation();
  z.setErrorMap(makeZodI18nMap({ t, handlePath: false }));

  // Must be called within <BrowserRouter> because it uses hook useLocation().
  useGoatCounter();
  useScrollToTop();

  return (
    <HelmetProvider>
      <UserFeedback />
      {goatCounterCode && (
        <Helmet>
          {/* Helmet is linked to <head>. Used to add scripts. */}
          {/* Must be wrapped by <HelmetProvider> */}
          <script
            data-goatcounter={`https://${import.meta.env.VITE_GOATCOUNTER_CODE}.goatcounter.com/count`}
            data-goatcounter-settings={localSetup}
            async
            src="//gc.zgo.at/count.js"
          />
        </Helmet>
      )}
      <CommandMenu />
      <Outlet />
      {/* Move down from navbar. */}
      <ToastContainer style={{ marginTop: '45px' }} theme={isDarkTheme ? 'dark' : 'light'} />
    </HelmetProvider>
  );
}
