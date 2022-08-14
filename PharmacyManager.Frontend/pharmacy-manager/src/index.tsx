import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PharmacyManagerApp } from './components';
import { BackendService } from './services/BackendService';

let root: ReactDOM.Root

window.RenderPharmacyManager = (rootDiv: string) => {
  root = ReactDOM.createRoot(
    document.getElementById(rootDiv) as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <PharmacyManagerApp backendService={new BackendService(window.pharmacyManagerConfiguration.baseApiUrl)} />
    </React.StrictMode>
  );
}