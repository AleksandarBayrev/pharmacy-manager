import { IObservableValue, action } from "mobx";
export interface IGetDateTimeStore {
    date: IObservableValue<Date>;
    setDate(date: Date): void;
}