import { Language } from "../base";

export interface ITranslationManager {
    loadTranslations(): Promise<void>;
    getTranslation(language: Language, key: string): string;
}