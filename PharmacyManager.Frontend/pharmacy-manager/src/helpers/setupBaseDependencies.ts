import { DependencyInjection } from "../base";
import { LogManager, BackendService } from "../services";
import { TranslationManager } from "../services/TranslationManager";
import { SettingsStore } from "../stores";
import { AppStore } from "../stores/AppStore";
import { ILogManager, IBackendService, ITranslationManager, ISettingsStore, IAppStore } from "../types";
import { setupLoggers } from "./setupLoggers";

export const setupBaseDependencies = async (DI: DependencyInjection) => {
    DI.registerService<ILogManager>("ILogManager", "singleton", LogManager, []);
    const logManager = DI.getService<ILogManager>("ILogManager");
    setupLoggers(logManager);
    DI.registerService<IBackendService>("IBackendService", "singleton", BackendService, [window.pharmacyManagerConfiguration.baseApiUrl, logManager.getLogger("App")]);
    const backendService = DI.getService<IBackendService>("IBackendService");
    DI.registerService<ITranslationManager>("ITranslationManager", "singleton", TranslationManager, [backendService]);
    const translationManager = DI.getService<ITranslationManager>("ITranslationManager");
    await translationManager.loadTranslations();
    DI.registerService<ISettingsStore>("ISettingsStore", "singleton", SettingsStore, []);
    DI.registerService<IAppStore>("IAppStore", "singleton", AppStore, []);
}