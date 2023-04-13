import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppRoutes } from '~/AppRoutes';

import 'react-toastify/dist/ReactToastify.min.css';

// Neccessary import for translations.
import './i18n/i18n';

export function App() {
  const goatCounterCode = import.meta.env.VITE_GOATCOUNTER_CODE;
  const isDev = import.meta.env.DEV;
  const localSetup = isDev ? '{"allow_local": true}' : undefined;

  return (
    <HelmetProvider>
      <BrowserRouter>
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
        {/* Move down from navbar. */}
        <ToastContainer style={{ marginTop: '45px' }} />
      </BrowserRouter>
    </HelmetProvider>
  );
}
