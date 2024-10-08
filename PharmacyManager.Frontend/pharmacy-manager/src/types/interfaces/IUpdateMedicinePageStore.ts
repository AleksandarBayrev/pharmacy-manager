import { IObservableValue } from "mobx";
import React from "react";
import { UpdateMedicineRequest } from "../requests";
import { IBaseStore } from "./IBaseStore";

export interface IUpdateMedicinePageStore extends IBaseStore {
    request: UpdateMedicineRequest;
    isLoadingMedicine: IObservableValue<boolean>;
    isUpdatingMedicine: IObservableValue<boolean>;
    isRequestSuccessful: IObservableValue<boolean | undefined>;
    hasChanges: IObservableValue<boolean>;
    updateMedicine(_: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
    resetMessage(): void;
    resetRequestToDefault(): void;
    updateRequest(request: Partial<UpdateMedicineRequest>): void;
}