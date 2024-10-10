import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from '~/context/AuthContext';
import '~/global.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { OrganizationContextProvider } from '~/context/OrgContextProvider';
import { reportWebVitals } from '~/reportWebVitals';
import { router } from '~/router/router';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
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
  </QueryClientProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
