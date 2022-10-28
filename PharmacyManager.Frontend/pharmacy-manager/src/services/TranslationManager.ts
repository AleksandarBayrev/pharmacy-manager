import { IBackendService, ITranslationManager, Language, TranslationsResponse } from "../types";

export class TranslationManager implements ITranslationManager {
    private translations!: TranslationsResponse;
    private readonly backendService: IBackendService;

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
    }
    
    async loadTranslations() {
        this.translations = await this.backendService.getTranslations();
    }

    getTranslation(language: Language, key: string): string {
        return this.translations[language][key] ?? key;
    }    
}