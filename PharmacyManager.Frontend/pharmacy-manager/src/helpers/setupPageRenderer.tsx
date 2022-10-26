import React from "react";
import { DependencyInjection } from "../base";
import { AddMedicinePage } from "../components/Pages/AddMedicinePage/AddMedicinePage";
import { GetMedicineListPage } from "../components/Pages/GetMedicineListPage/GetMedicineListPage";
import { HomePage } from "../components/Pages/HomePage/HomePage";
import { UpdateMedicinePage } from "../components/Pages/UpdateMedicinePage/UpdateMedicinePage";
import { pages } from "../components/PharmacyManagerApp/constants";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetMedicineListPageStore, IPageRenderer } from "../types";

export const setupPageRenderer = (DI: DependencyInjection) => {
    const pageRenderer = DI.getService<IPageRenderer>("IPageRenderer");
    pageRenderer.add(pages.Home, <HomePage />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage
        backendService={DI.getService<IBackendService>("IBackendService")}
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IGetMedicineListPageStore>("IGetMedicineListPageStore")} />
    );
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage
        backendService={DI.getService<IBackendService>("IBackendService")}
        dateFormatter={DI.getService<IDateFormatter>("IDateFormatter")}
        store={DI.getService<IAddMedicinePageStore>("IAddMedicinePageStore")} />
    );
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage
        backendService={DI.getService<IBackendService>("IBackendService")} />
    );
}