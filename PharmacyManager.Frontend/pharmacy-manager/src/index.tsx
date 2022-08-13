import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

let root: ReactDOM.Root

window.RenderPharmacyManager = (rootDiv: string) => {
  root = ReactDOM.createRoot(
    document.getElementById(rootDiv) as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}