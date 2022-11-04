import { IGetDateTimeStore } from "../types";
import { observable, IObservableValue, action } from "mobx";
import { enhanceClass } from "../base/enhanceClass";

class GetDateTimeStore implements IGetDateTimeStore {
    @observable
    public date: IObservableValue<Date>;

    constructor() {
        this.date = observable.box(new Date());
    }
    async load(): Promise<void> {}
    async unload(): Promise<void> {}

    @action.bound
    public setDate(date: Date) {
        this.date.set(date);
    }
}

enhanceClass(GetDateTimeStore, "GetDateTimeStore");

export { GetDateTimeStore }