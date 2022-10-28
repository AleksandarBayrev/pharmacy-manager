import { IObservableValue, IObservableArray } from "mobx";
import { MedicineModel } from "../models";
import { MedicineRequest } from "../requests";
import { IBaseStore } from "./IBaseStore";

export interface IGetMedicineListPageStore extends IBaseStore {
    request: MedicineRequest;
    medicines: IObservableArray<MedicineModel>; 
    pages: IObservableValue<number>;
    loadingData: IObservableValue<boolean>;
    isInitialRequestMade: IObservableValue<boolean>;
    showPageCount: IObservableValue<boolean>;
    readonly defaultRequest: MedicineRequest;

    updateRequestProperties(request: Partial<MedicineRequest>): void;
    updateCurrentRequest(): void;
    resetUpdateInterval(): void;
    stopUpdateInterval(): void;
    getMedicines(request: MedicineRequest, useLoadingTimeout: boolean): Promise<void>;
    refetch(shouldWait: boolean): void;
    resetRequestToDefaults(): void;
}