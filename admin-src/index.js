import { createRoot, render } from '@wordpress/element';
import { App } from './App';
import './styles/tokens.css';
import './styles/shell.css';
import './styles/screens.css';
import './ui';
import './style.css';

const root = document.getElementById('noksha-root');
if (root) {
  const app = <App />;
  if (typeof createRoot === 'function') {
    createRoot(root).render(app);
  } else {
    render(app, root);
  }
}
