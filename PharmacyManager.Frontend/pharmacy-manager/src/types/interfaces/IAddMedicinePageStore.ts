import { IObservableValue } from "mobx";
import React from "react";
import { AddMedicineRequest } from "../models";

export interface IAddMedicinePageStore {
    request: AddMedicineRequest;
    isAddingMedicine: IObservableValue<boolean>;
    isRequestSuccessful: IObservableValue<boolean | undefined>;
    addMedicine(_: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void>;
    resetMessage(): void;
    resetRequestToDefault(): void;
    updateRequest(request: Partial<AddMedicineRequest>): void;
}