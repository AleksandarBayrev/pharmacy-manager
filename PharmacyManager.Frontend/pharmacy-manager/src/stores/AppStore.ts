import { action, IObservableValue, observable, runInAction } from "mobx";
import { pages } from "../constants";
import { Language } from "../types";
import { IAppStore } from "../types/interfaces/IAppStore";

export class AppStore implements IAppStore {
    @observable
    public currentPage: IObservableValue<string>;
    @observable
    public language: IObservableValue<Language>;

    private readonly storageKey = "ApplicationLanguage";
    
    constructor() {
        this.currentPage = observable.box(pages.Home);
        this.language = observable.box(this.loadLanguageFromStorage());
    }

    setCurrentPage = (currentPage: string) => {
        runInAction(() => {
            this.currentPage.set(currentPage);
        });
    }

    selectLanguage = (language: Language) => {
        runInAction(() => {
            this.language.set(language);
        });
        localStorage.setItem(this.storageKey, language);
    }

    async load(): Promise<void> {}
    async unload(): Promise<void> {}

    private loadLanguageFromStorage() {
        try {
            return localStorage.getItem(this.storageKey) as Language ?? Language.English;
        } catch {
            return Language.English;
        }
    }
}