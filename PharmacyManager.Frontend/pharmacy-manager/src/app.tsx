import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/Base.css';
import { Loader, PharmacyManagerApp } from './views';
import { DependencyInjection } from './base';
import { ILanguageSelectorStore, ILogManager, ITranslationManager } from './types';

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
            <Loader
                logger={DI.getService<ILogManager>("ILogManager").getLogger("App")}
                translationManager={DI.getService<ITranslationManager>("ITranslationManager")}
                languageSelectorStore={DI.getService<ILanguageSelectorStore>("ILanguageSelectorStore")} />
        </React.StrictMode>
    );
}

export const app = async (DependencyInjection: DependencyInjection, setup: (DependencyInjection: DependencyInjection) => Promise<void>) => {
    createRoot();
    renderLoader(DependencyInjection);
    await setup(DependencyInjection);
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