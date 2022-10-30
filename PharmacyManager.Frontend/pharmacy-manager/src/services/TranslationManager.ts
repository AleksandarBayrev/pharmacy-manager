import { enhanceClass } from "../base/enhanceClass";
import { IBackendService, ITranslationManager, Language, TranslationsResponse } from "../types";

class TranslationManager implements ITranslationManager {
    private translations!: TranslationsResponse;
    private readonly backendService: IBackendService;

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
    }
    
    async loadTranslations() {
        this.translations = await this.backendService.getTranslations();
    }

    async reloadTranslations() {
        const updatedTranslations = await this.backendService.reloadTranslations();
        this.translations = {
            ...{...this.translations},
            ...updatedTranslations
        };
    }

    getTranslation(language: Language, key: string): string {
        return this.translations[language][key] ?? key;
    }    
}

enhanceClass(TranslationManager, "TranslationManager");

export { TranslationManager }