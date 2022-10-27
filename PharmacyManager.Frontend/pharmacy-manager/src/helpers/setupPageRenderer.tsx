import React from "react";
import { DependencyInjection } from "../base";
import { pages } from "../constants";
import { HomePage, GetMedicineListPage, AddMedicinePage, UpdateMedicinePage } from "../view/pages";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetMedicineListPageStore, IPageRenderer } from "../types";

export const setupPageRenderer = (DI: DependencyInjection) => {
    const pageRenderer = DI.getService<IPageRenderer>("IPageRenderer");
    pageRenderer.add(pages.Home, <HomePage />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IGetMedicineListPageStore>("IGetMedicineListPageStore")} />
    );
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IAddMedicinePageStore>("IAddMedicinePageStore")} />
    );
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage
        backendService={DI.getService<IBackendService>("IBackendService")} />
    );
}