import { IObservableValue } from "mobx";
import { Language } from "../base";
import { IBaseStore } from "./IBaseStore";

export interface ILanguageSelectorStore extends IBaseStore {
    language: IObservableValue<Language>;
    selectLanguage: (language: Language) => void;
}