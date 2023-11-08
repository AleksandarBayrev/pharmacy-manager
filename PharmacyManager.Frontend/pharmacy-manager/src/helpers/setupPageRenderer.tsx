import React from "react";
import { DependencyInjection } from "../base";
import { pages } from "../constants";
import { HomePage, GetMedicineListPage, AddMedicinePage, UpdateMedicinePage } from "../views/pages";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetMedicineListPageStore, IPageRenderer, ITranslationManager, IAppStore, IUpdateMedicinePageStore } from "../types";
import { SettingsPage } from "../views/pages/SettingsPage";

export const setupPageRenderer = (DI: DependencyInjection) => {
    const pageRenderer = DI.getService<IPageRenderer>("IPageRenderer");
    pageRenderer.add(pages.Home, <HomePage
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")}
        appStore={DI.getService<IAppStore>("IAppStore")} />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IGetMedicineListPageStore>("IGetMedicineListPageStore")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")}
        appStore={DI.getService<IAppStore>("IAppStore")} />
    );
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IAddMedicinePageStore>("IAddMedicinePageStore")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")}
        appStore={DI.getService<IAppStore>("IAppStore")} />
    );
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage
        backendService={DI.getService<IBackendService>("IBackendService")}
        store={DI.getService<IUpdateMedicinePageStore>("IUpdateMedicinePageStore")}
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")}
        appStore={DI.getService<IAppStore>("IAppStore")} />
    );
    pageRenderer.add(pages.Settings, <SettingsPage
        translationManager={DI.getService<ITranslationManager>("ITranslationManager")}
        appStore={DI.getService<IAppStore>("IAppStore")} />
    );
}