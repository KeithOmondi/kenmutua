import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          success: { className: 'text-sm font-medium !bg-green-50 !text-green-800' },
          error:   { className: 'text-sm font-medium !bg-red-50 !text-red-800' },
        }}
      />
    </Provider>
  </StrictMode>,
);