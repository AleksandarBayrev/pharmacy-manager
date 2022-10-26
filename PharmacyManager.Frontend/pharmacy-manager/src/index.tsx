import { app } from "./app";
import { DependencyInjection } from "./base";
import { setupLoggers, setupPageRenderer } from "./helpers";
import { BackendService } from "./services/BackendService";
import { DateFormatter } from "./services/DateFormatter";
import { LogManager } from "./services/LogManager";
import { PageRenderer } from "./services/PageRenderer";
import { TimeFormatter } from "./services/TimeFormatter";
import { AddMedicinePageStore } from "./store/AddMedicinePageStore";
import { GetDateTimeStore } from "./store/GetDateTimeStore";
import { GetMedicineListPageStore } from "./store/GetMedicineListPageStore";
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetDateTimeStore, IGetMedicineListPageStore, ILogManager, IPageRenderer, ITimeFormatter } from "./types";

DependencyInjection.setupInstance(console.log);
app(() => {
  const DependencyInjectionInstance = DependencyInjection.getInstance();
  DependencyInjectionInstance.registerService<ILogManager>("ILogManager", "singleton", LogManager, []);
  const logManager = DependencyInjectionInstance.getService<ILogManager>("ILogManager");
  setupLoggers(logManager);
  DependencyInjectionInstance.registerService<IBackendService>("IBackendService", "singleton", BackendService, [window.pharmacyManagerConfiguration.baseApiUrl]);
  DependencyInjectionInstance.registerService<IPageRenderer>("IPageRenderer", "singleton", PageRenderer, [logManager.getLogger("PageRenderer")]);
  DependencyInjectionInstance.registerService<IDateFormatter>("IDateFormatter", "singleton", DateFormatter, []);
  DependencyInjectionInstance.registerService<ITimeFormatter>("ITimeFormatter", "singleton", TimeFormatter, []);
  DependencyInjectionInstance.registerService<IGetMedicineListPageStore>("IGetMedicineListPageStore", "singleton", GetMedicineListPageStore, [DependencyInjection.getInstance().getService<IBackendService>("IBackendService")]);
  DependencyInjectionInstance.registerService<IGetDateTimeStore>("IGetDateTimeStore", "singleton", GetDateTimeStore, []);
  DependencyInjectionInstance.registerService<IAddMedicinePageStore>("IAddMedicinePageStore", "singleton", AddMedicinePageStore, [DependencyInjection.getInstance().getService<IBackendService>("IBackendService")]);
  setupPageRenderer(DependencyInjectionInstance);
}).run(DependencyInjection.getInstance());