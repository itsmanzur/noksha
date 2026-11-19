import { createRoot, render } from '@wordpress/element';
import { App } from './App';
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
