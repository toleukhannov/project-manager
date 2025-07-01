// libraries
import type { FC } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
// routes
import { routes } from 'components/Routes';

const AppRoutes = () => useRoutes(routes);

const App: FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
