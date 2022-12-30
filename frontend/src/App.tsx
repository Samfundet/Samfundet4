import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '~/AppRoutes';
import { Navbar } from '~/Components/Navbar';
import {Footer} from '~/Components/Footer';

// Neccessary import for translations.
import './i18n/i18n';

export function App() {
  const goatCounterCode = import.meta.env.VITE_GOATCOUNTER_CODE;
  const isDev = import.meta.env.DEV;
  const localSetup = isDev ? '{"allow_local": true}' : undefined;

  return (
<<<<<<< HEAD
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer iconSize={45}/>
    </BrowserRouter>
=======
    <HelmetProvider>
      <BrowserRouter>
        {goatCounterCode && (
          <>
            {/* Helmet is linked to <head>. Used to add scripts. */}
            {/* Must be wrapped by <HelmetProvider> */}
            <Helmet>
              <script
                data-goatcounter={`https://${import.meta.env.VITE_GOATCOUNTER_CODE}.goatcounter.com/count`}
                data-goatcounter-settings={localSetup}
                async
                src="//gc.zgo.at/count.js"
              />
            </Helmet>
          </>
        )}
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
>>>>>>> origin/master
  );
}
