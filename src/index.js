import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <MantineProvider defaultColorScheme='dark'>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </MantineProvider>
  </Provider>
);

reportWebVitals();
