import React from 'react';
import ReactDOM from 'react-dom/client';
import './Shared/Base.css';
import { Loader, PharmacyManagerApp } from './views';
import { DependencyInjection } from './base';

let root: ReactDOM.Root

const createRoot = () => {
    if (!root) {
        root = ReactDOM.createRoot(
            document.getElementById(window.pharmacyManagerConfiguration.appDivId) as HTMLElement
        );
    }
}

const renderLoader = () => {
    root.render(
        <React.StrictMode>
            <Loader />
        </React.StrictMode>
    );
}

export const app = async (setup: () => Promise<void>) => {
    createRoot();
    renderLoader();
    await setup();
    return {
        run: (DependencyInjection: DependencyInjection) => {
            window.RenderPharmacyManager = (rootDiv: string) => {
                if (!root) {
                    root = ReactDOM.createRoot(
                        document.getElementById(rootDiv) as HTMLElement
                    );
                }
                root.render(
                    <React.StrictMode>
                        <PharmacyManagerApp DependencyInjection={DependencyInjection} />
                    </React.StrictMode>
                );
            }
        }
    }
}