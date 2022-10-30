import { action, IObservableValue, observable } from "mobx";
import { pages } from "../constants";
import { IAppStore } from "../types/interfaces/IAppStore";

export class AppStore implements IAppStore {
    @observable
    public currentPage: IObservableValue<string>;
    
    constructor() {
        this.currentPage = observable.box(pages.Home);
    }

    @action
    setCurrentPage = (currentPage: string) => {
        this.currentPage.set(currentPage);
    }
    async load(): Promise<void> {}
    async unload(): Promise<void> {}

}