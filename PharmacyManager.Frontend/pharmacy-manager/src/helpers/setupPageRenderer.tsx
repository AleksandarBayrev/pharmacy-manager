import React from "react";
import { DependencyInjection } from "../base";
import { pages } from "../constants";
import { HomePage, GetMedicineListPage, AddMedicinePage, UpdateMedicinePage } from "../views/pages";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetMedicineListPageStore, ISettingsStore, IPageRenderer, ITranslationManager } from "../types";
import { SettingsPage } from "../views/pages/SettingsPage";

export const setupPageRenderer = (DI: DependencyInjection) => {
    const pageRenderer = DI.getService<IPageRenderer>("IPageRenderer");
    pageRenderer.add(pages.Home, <HomePage
        settingsStore={DI.getService<ISettingsStore>("ISettingsStore")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")} />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IGetMedicineListPageStore>("IGetMedicineListPageStore")}
        settingsStore={DI.getService<ISettingsStore>("ISettingsStore")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")} />
    );
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IAddMedicinePageStore>("IAddMedicinePageStore")}
        settingsStore={DI.getService<ISettingsStore>("ISettingsStore")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")} />
    );
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage
        backendService={DI.getService<IBackendService>("IBackendService")} />
    );
    pageRenderer.add(pages.Settings, <SettingsPage
        settingsStore={DI.getService<ISettingsStore>("ISettingsStore")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")} />
    );
}