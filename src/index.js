import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import ToolProvider from './context/toolProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToolProvider>
      <App />
    </ToolProvider>
  </React.StrictMode>
);
