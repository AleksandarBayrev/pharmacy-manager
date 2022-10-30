import { IObservableValue } from "mobx";
import { Language } from "../base";
import { IBaseStore } from "./IBaseStore";

export interface IAppStore extends IBaseStore {
    currentPage: IObservableValue<string>;
    language: IObservableValue<Language>;
    selectLanguage: (language: Language) => void;
    setCurrentPage: (currentPage: string) => void;
}