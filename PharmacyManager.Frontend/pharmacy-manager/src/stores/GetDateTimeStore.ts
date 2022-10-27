import { IGetDateTimeStore } from "../types";
import { observable, IObservableValue, action } from "mobx";
import { enhanceClass } from "../base/enhanceClass";

class GetDateTimeStore implements IGetDateTimeStore {
    public date: IObservableValue<Date>;

    constructor() {
        this.date = observable.box(new Date());
    }

    @action.bound
    public setDate(date: Date) {
        this.date.set(date);
    }
}

enhanceClass(GetDateTimeStore, "GetDateTimeStore");

export { GetDateTimeStore }