import { app } from "./app";
import { DependencyInjection } from "./base";
import { AppLoadedEvent } from "./constants";
import { setupBaseDependencies, setupPageRenderer, showLogo } from "./helpers";
import { PageRenderer, DateFormatter, TimeFormatter } from "./services";
import { GetMedicineListPageStore, GetDateTimeStore, AddMedicinePageStore, LanguageSelectorStore } from "./stores";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetDateTimeStore, IGetMedicineListPageStore, ILanguageSelectorStore, ILogManager, IPageRenderer, ITimeFormatter } from "./types";

(async () => {
  DependencyInjection.setupInstance(console.log);
  const DependencyInjectionInstance = DependencyInjection.getInstance();
  await setupBaseDependencies(DependencyInjectionInstance);
  const appInstance = await app(DependencyInjectionInstance,
  async (DependencyInjectionInstance) => {
    await showLogo();
    const logManager = DependencyInjectionInstance.getService<ILogManager>("ILogManager");
    const backendService = DependencyInjectionInstance.getService<IBackendService>("IBackendService");
    DependencyInjectionInstance.registerService<IPageRenderer>("IPageRenderer", "singleton", PageRenderer, [logManager.getLogger("PageRenderer")]);
    DependencyInjectionInstance.registerService<IDateFormatter>("IDateFormatter", "singleton", DateFormatter, []);
    DependencyInjectionInstance.registerService<ITimeFormatter>("ITimeFormatter", "singleton", TimeFormatter, []);
    DependencyInjectionInstance.registerService<IGetMedicineListPageStore>("IGetMedicineListPageStore", "singleton", GetMedicineListPageStore, [backendService]);
    DependencyInjectionInstance.registerService<IGetDateTimeStore>("IGetDateTimeStore", "singleton", GetDateTimeStore, []);
    DependencyInjectionInstance.registerService<ILanguageSelectorStore>("ILanguageSelectorStore", "singleton", LanguageSelectorStore, []);
    DependencyInjectionInstance.registerService<IAddMedicinePageStore>("IAddMedicinePageStore", "singleton", AddMedicinePageStore, [backendService]);
    setupPageRenderer(DependencyInjectionInstance);
  });
  appInstance.run();
  window.dispatchEvent(AppLoadedEvent);
})();