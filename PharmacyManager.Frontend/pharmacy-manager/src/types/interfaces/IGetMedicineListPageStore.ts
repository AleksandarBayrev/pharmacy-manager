import { IObservableValue, IObservableArray } from "mobx";
import { MedicineModel } from "../models";
import { MedicineRequest } from "../requests";
import { IBaseStore } from "./IBaseStore";

export interface IGetMedicineListPageStore extends IBaseStore {
    request: MedicineRequest;
    medicines: IObservableArray<MedicineModel>; 
    pages: IObservableValue<number>;
    totalCount: IObservableValue<number>;
    totalFilteredCount: IObservableValue<number>;
    loadingData: IObservableValue<boolean>;
    isLoadingPage: IObservableValue<boolean>;
    isInitialRequestMade: IObservableValue<boolean>;
    showPageCount: IObservableValue<boolean>;
    additionalMessage: IObservableValue<string>;
    fetchingError: IObservableValue<boolean>;
    readonly defaultRequest: MedicineRequest;

    updateRequestProperties(request: Partial<MedicineRequest>): void;
    updateCurrentRequest(): void;
    resetUpdateInterval(): void;
    stopUpdateInterval(): void;
    getMedicines(request: MedicineRequest, useLoadingTimeout: boolean): void;
    refetch(shouldWait: boolean): void;
    resetRequestToDefaults(reloadData: boolean, shouldUpdateUrl: boolean): void;
    deleteMedicine(medicineId: string): void;
}