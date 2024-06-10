import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from '~/AuthContext';
import '~/global.scss';
import { GlobalContextProvider } from '~/GlobalContextProvider';
import { reportWebVitals } from '~/reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { router } from '~/AppRoutes';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AuthContextProvider>
    <GlobalContextProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </GlobalContextProvider>
  </AuthContextProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
