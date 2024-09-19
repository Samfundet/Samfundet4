import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from '~/context/AuthContext';
import '~/global.scss';
import { RouterProvider } from 'react-router-dom';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { OrganizationContextProvider } from '~/context/OrgContextProvider';
import { reportWebVitals } from '~/reportWebVitals';
import { router } from '~/router/router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AuthContextProvider>
    <GlobalContextProvider>
      <OrganizationContextProvider>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </OrganizationContextProvider>
    </GlobalContextProvider>
  </AuthContextProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
