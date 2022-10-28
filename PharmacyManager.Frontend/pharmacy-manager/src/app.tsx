import React from 'react';
import ReactDOM from 'react-dom/client';
import './Shared/Base.css';
import { Loader, PharmacyManagerApp } from './views';
import { DependencyInjection } from './base';
import { ILogManager } from './types';

let root: ReactDOM.Root

const createRoot = () => {
    if (!root) {
        root = ReactDOM.createRoot(
            document.getElementById(window.pharmacyManagerConfiguration.appDivId) as HTMLElement
        );
    }
}

const renderLoader = (DI: DependencyInjection) => {
    root.render(
        <React.StrictMode>
            <Loader logger={DI.getService<ILogManager>("ILogManager").getLogger("App")} />
        </React.StrictMode>
    );
}

export const app = async (DependencyInjection: DependencyInjection, setup: () => Promise<void>) => {
    await setup();
    createRoot();
    renderLoader(DependencyInjection);
    return {
        run: () => {
            window.RenderPharmacyManager = async (rootDiv: string, postSetup: (DI: DependencyInjection) => Promise<void>) => {
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
                await postSetup(DependencyInjection);
            }
        }
    }
}