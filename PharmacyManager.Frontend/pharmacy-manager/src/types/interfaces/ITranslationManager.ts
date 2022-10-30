import { Language } from "../base";

export interface ITranslationManager {
    loadTranslations(): Promise<void>;
    reloadTranslations(): Promise<void>;
    getTranslation(language: Language, key: string): string;
}