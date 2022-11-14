import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '~/App';
import { AuthContextProvider } from '~/AuthContext';
import '~/global.scss';
import { GlobalContextProvider } from '~/GlobalContextProvider';
import { reportWebVitals } from '~/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <GlobalContextProvider>
    <AuthContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContextProvider>
  </GlobalContextProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
