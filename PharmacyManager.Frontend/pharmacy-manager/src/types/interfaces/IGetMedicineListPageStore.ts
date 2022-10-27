import { IObservableValue, IObservableArray } from "mobx";
import { MedicineModel } from "../models";
import { MedicineRequest } from "../requests";

export interface IGetMedicineListPageStore {
    request: MedicineRequest;
    medicines: IObservableArray<MedicineModel>; 
    pages: IObservableValue<number>;
    loadingData: IObservableValue<boolean>;
    isInitialRequestMade: IObservableValue<boolean>;
    showPageCount: IObservableValue<boolean>;
    readonly defaultRequest: MedicineRequest;

    load(): Promise<void>;
    unload(): Promise<void>;
    updateRequestProperties(request: Partial<MedicineRequest>): void;
    updateCurrentRequest(): void;
    resetUpdateInterval(): void;
    stopUpdateInterval(): void;
    getMedicines(request: MedicineRequest, useLoadingTimeout: boolean): Promise<void>;
    refetch(shouldWait: boolean): void;
    resetRequestToDefaults(): void;
}