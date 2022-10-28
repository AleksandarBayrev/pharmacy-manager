import React from 'react';
import ReactDOM from 'react-dom/client';
import './Shared/Base.css';
import { PharmacyManagerApp } from './view/PharmacyManagerApp';
import { DependencyInjection } from './base';

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
                        <PharmacyManagerApp DependencyInjection={DependencyInjection} />
                    </React.StrictMode>
                );
            }
        }
    }
}