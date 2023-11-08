import { IObservableValue } from "mobx";
import React from "react";
import { UpdateMedicineRequest } from "../requests";
import { IBaseStore } from "./IBaseStore";

export interface IUpdateMedicinePageStore extends IBaseStore {
    request: UpdateMedicineRequest;
    isLoadingMedicine: IObservableValue<boolean>;
    isUpdatingMedicine: IObservableValue<boolean>;
    isRequestSuccessful: IObservableValue<boolean | undefined>;
    updateMedicine(_: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void>;
    resetMessage(): void;
    resetRequestToDefault(): void;
    updateRequest(request: Partial<UpdateMedicineRequest>): void;
}