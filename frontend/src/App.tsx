import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppRoutes } from '~/AppRoutes';
import { useIsDarkTheme } from '~/hooks';

import 'react-toastify/dist/ReactToastify.min.css';

// Neccessary import for translations.
import { CommandMenu } from './Components/CommandMenu';
import './i18n/i18n';
import { UserFeedback } from '~/Components/UserFeedback/UserFeedback';
import { CommandSprut } from '~/Components/CommandSprut/CommandSprut';

export function App() {
  const goatCounterCode = import.meta.env.VITE_GOATCOUNTER_CODE;
  const isDev = import.meta.env.DEV;
  const localSetup = isDev ? '{"allow_local": true}' : undefined;
  const isDarkTheme = useIsDarkTheme();

  return (
    <HelmetProvider>
      <BrowserRouter>
        <UserFeedback enabled={true} />
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
        <AppRoutes />
        <CommandMenu />
        <CommandSprut />
        {/* Move down from navbar. */}
        <ToastContainer style={{ marginTop: '45px' }} theme={isDarkTheme ? 'dark' : 'light'} />
      </BrowserRouter>
    </HelmetProvider>
  );
}
