import { IObservableValue } from "mobx";
import React from "react";
import { AddMedicineRequest } from "../models";
import { IBaseStore } from "./IBaseStore";

export interface IAddMedicinePageStore extends IBaseStore {
    request: AddMedicineRequest;
    isAddingMedicine: IObservableValue<boolean>;
    isRequestSuccessful: IObservableValue<boolean | undefined>;
    addMedicine(_: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void>;
    resetMessage(): void;
    resetRequestToDefault(): void;
    updateRequest(request: Partial<AddMedicineRequest>): void;
}