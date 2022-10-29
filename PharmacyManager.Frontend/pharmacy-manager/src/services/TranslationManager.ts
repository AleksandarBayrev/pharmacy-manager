import { IBackendService, ILogger, ITranslationManager, Language, TranslationsResponse } from "../types";

export class TranslationManager implements ITranslationManager {
    private translations!: TranslationsResponse;
    private readonly logger: ILogger;
    private readonly backendService: IBackendService;

    constructor(
        logger: ILogger,
        backendService: IBackendService) {
        this.logger = logger;
        this.backendService = backendService;
    }
    
    async loadTranslations() {
        try {
            this.translations = await this.backendService.getTranslations();
        } catch (err) {
            this.logger.Error(err as Error);
            this.logger.Info("Translations not loaded, check backend!");
        }
    }

    getTranslation(language: Language, key: string): string {
        return this.translations[language][key] ?? key;
    }    
}