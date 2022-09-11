import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Arrangementer } from './pages/arrangementer/Arrangementer';
import { Welcome } from './pages/hjem/Welcome';

export function RouterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/arrangementer" element={<Arrangementer />} />
    </Routes>
  );
}
