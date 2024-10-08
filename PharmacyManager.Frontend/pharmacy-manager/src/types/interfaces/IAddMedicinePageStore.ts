import { IObservableValue } from "mobx";
import React from "react";
import { AddMedicineRequest } from "../requests";
import { IBaseStore } from "./IBaseStore";

export interface IAddMedicinePageStore extends IBaseStore {
    request: AddMedicineRequest;
    isAddingMedicine: IObservableValue<boolean>;
    isRequestSuccessful: IObservableValue<boolean | undefined>;
    addMedicine(_: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
    resetMessage(): void;
    resetRequestToDefault(): void;
    updateRequest(request: Partial<AddMedicineRequest>): void;
}