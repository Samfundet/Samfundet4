import { Route, Routes } from 'react-router-dom';
import { HomePage } from './Pages';

export function RouterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
