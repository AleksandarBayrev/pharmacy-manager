import { action, IObservableValue, observable } from "mobx";
import { enhanceClass } from "../base/enhanceClass";
import { ILanguageSelectorStore, Language } from "../types";

class LanguageSelectorStore implements ILanguageSelectorStore {
    @observable
    public language: IObservableValue<Language>;

    private readonly storageKey = "ApplicationLanguage";

    constructor() {
        this.language = observable.box(this.loadLanguageFromStorage());
    }
    async load(): Promise<void> {
    }
    async unload(): Promise<void> {
    }

    @action
    selectLanguage = (language: Language) => {
        this.language.set(language);
        localStorage.setItem(this.storageKey, language);
    }

    private loadLanguageFromStorage() {
        try {
            return localStorage.getItem(this.storageKey) as Language;
        } catch {
            return Language.English;
        }
    }
}

enhanceClass(LanguageSelectorStore, "LanguageSelectorStore");

export { LanguageSelectorStore };