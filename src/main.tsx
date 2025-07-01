// libraries
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// components
import App from 'components/App';
// styles
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'styles/index.scss';

import { store } from 'store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
