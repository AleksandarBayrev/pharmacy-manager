import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PharmacyManagerApp } from './components';
import { DependencyInjection } from './base';
import { IBackendService } from './types';

let root: ReactDOM.Root

export const app = (setup: () => void) => {
    setup();
    return {
        run: (DependencyInjection: DependencyInjection) => {
            window.RenderPharmacyManager = (rootDiv: string) => {
                root = ReactDOM.createRoot(
                    document.getElementById(rootDiv) as HTMLElement
                );
                root.render(
                    <React.StrictMode>
                        <PharmacyManagerApp backendService={DependencyInjection.getService<IBackendService>("IBackendService")} />
                    </React.StrictMode>
                );
            }
        }
    }
}