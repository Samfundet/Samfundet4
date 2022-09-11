import React from 'react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { RouterRoutes } from './RouterRoutes';

export function App() {
  const a = axios.get('http://localhost:8000/arrangementer/api2/test');
  console.log(a);

  return (
    <BrowserRouter>
      <RouterRoutes />
    </BrowserRouter>
  );
}
