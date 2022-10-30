import { IObservableValue } from "mobx";
import { IBaseStore } from "./IBaseStore";

export interface IAppStore extends IBaseStore {
    currentPage: IObservableValue<string>;
    setCurrentPage: (currentPage: string) => void;
}