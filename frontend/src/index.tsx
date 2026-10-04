import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { OrganizationContextProvider } from '~/context/OrgContextProvider';
import '~/global.scss';
import { CookiesProvider } from 'react-cookie';
import { reportWebVitals } from '~/reportWebVitals';
import { router } from '~/router/router';
import { queryClient } from './domain';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <CookiesProvider>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <GlobalContextProvider>
          <OrganizationContextProvider>
            <React.StrictMode>
              <RouterProvider router={router} />
            </React.StrictMode>
          </OrganizationContextProvider>
        </GlobalContextProvider>
      </AuthContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </CookiesProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
