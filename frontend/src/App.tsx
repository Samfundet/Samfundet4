import { BrowserRouter } from 'react-router-dom';
import { RouterRoutes } from './RouterRoutes';

export function App() {
  return (
    <BrowserRouter>
      <RouterRoutes />
    </BrowserRouter>
  );
}
