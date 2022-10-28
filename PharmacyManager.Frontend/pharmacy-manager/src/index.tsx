import { app } from "./app";
import { DependencyInjection } from "./base";
import { AppLoadedEvent } from "./constants";
import { setupLoggers, setupPageRenderer } from "./helpers";
import { LogManager, BackendService, PageRenderer, DateFormatter, TimeFormatter } from "./services";
import { TranslationManager } from "./services/TranslationManager";
import { GetMedicineListPageStore, GetDateTimeStore, AddMedicinePageStore } from "./stores";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetDateTimeStore, IGetMedicineListPageStore, ILogManager, IPageRenderer, ITimeFormatter, ITranslationManager } from "./types";

(async () => {
  DependencyInjection.setupInstance(console.log);
  const appInstance = await app(DependencyInjection.getInstance(),
  async () => {
    const DependencyInjectionInstance = DependencyInjection.getInstance();
    DependencyInjectionInstance.registerService<ILogManager>("ILogManager", "singleton", LogManager, []);
    const logManager = DependencyInjectionInstance.getService<ILogManager>("ILogManager");
    setupLoggers(logManager);
    DependencyInjectionInstance.registerService<ITranslationManager>("ITranslationManager", "singleton", TranslationManager, [DependencyInjection.getInstance().getService<IBackendService>("IBackendService")]);
    DependencyInjectionInstance.registerService<IBackendService>("IBackendService", "singleton", BackendService, [window.pharmacyManagerConfiguration.baseApiUrl, logManager.getLogger("App")]);
    DependencyInjectionInstance.registerService<IPageRenderer>("IPageRenderer", "singleton", PageRenderer, [logManager.getLogger("PageRenderer")]);
    DependencyInjectionInstance.registerService<IDateFormatter>("IDateFormatter", "singleton", DateFormatter, []);
    DependencyInjectionInstance.registerService<ITimeFormatter>("ITimeFormatter", "singleton", TimeFormatter, []);
    DependencyInjectionInstance.registerService<IGetMedicineListPageStore>("IGetMedicineListPageStore", "singleton", GetMedicineListPageStore, [DependencyInjection.getInstance().getService<IBackendService>("IBackendService")]);
    DependencyInjectionInstance.registerService<IGetDateTimeStore>("IGetDateTimeStore", "singleton", GetDateTimeStore, []);
    DependencyInjectionInstance.registerService<IAddMedicinePageStore>("IAddMedicinePageStore", "singleton", AddMedicinePageStore, [DependencyInjection.getInstance().getService<IBackendService>("IBackendService")]);
    setupPageRenderer(DependencyInjectionInstance);
  });
  appInstance.run();
  window.dispatchEvent(AppLoadedEvent);
})();