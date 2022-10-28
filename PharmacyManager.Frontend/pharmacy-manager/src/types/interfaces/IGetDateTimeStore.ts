import { IObservableValue } from "mobx";
import { IBaseStore } from "./IBaseStore";
export interface IGetDateTimeStore extends IBaseStore {
    date: IObservableValue<Date>;
    setDate(date: Date): void;
}