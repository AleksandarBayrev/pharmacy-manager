import React from 'react';
import ReactDOM from 'react-dom/client';
import './Shared/Base.css';
import { Loader, PharmacyManagerApp } from './views';
import { DependencyInjection } from './base';

let loaderRoot: ReactDOM.Root
let root: ReactDOM.Root

const renderLoader = () => {
    loaderRoot = ReactDOM.createRoot(
        document.getElementById(window.pharmacyManagerConfiguration.loaderDivId) as HTMLElement
    );
    loaderRoot.render(
        <React.StrictMode>
            <Loader />
        </React.StrictMode>
    );
}

const unmountLoader = () => {
    if (loaderRoot) {
        loaderRoot.unmount();
        document.getElementById(window.pharmacyManagerConfiguration.loaderDivId)?.remove();
    }
}

export const app = async (setup: () => Promise<void>) => {
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
                setTimeout(unmountLoader);
            }
        }
    }
}