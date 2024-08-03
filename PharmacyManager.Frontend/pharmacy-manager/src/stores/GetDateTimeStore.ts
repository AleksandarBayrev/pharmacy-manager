import { IGetDateTimeStore } from "../types";
import { observable, IObservableValue, runInAction } from "mobx";
import { enhanceClass } from "../base/enhanceClass";

class GetDateTimeStore implements IGetDateTimeStore {
    @observable
    public date: IObservableValue<Date>;

    constructor() {
        this.date = observable.box(new Date());
    }
    async load(): Promise<void> {}
    async unload(): Promise<void> {}

    public setDate = (date: Date) => {
        runInAction(() => {
            this.date.set(date);
        });
    }
}

enhanceClass(GetDateTimeStore, "GetDateTimeStore");

export { GetDateTimeStore }