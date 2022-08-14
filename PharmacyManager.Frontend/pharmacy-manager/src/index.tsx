import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PharmacyManagerApp } from './components';
import { DependencyInjection } from './base';

let root: ReactDOM.Root

window.RenderPharmacyManager = (rootDiv: string) => {
  root = ReactDOM.createRoot(
    document.getElementById(rootDiv) as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <PharmacyManagerApp backendService={DependencyInjection.backendService} />
    </React.StrictMode>
  );
}