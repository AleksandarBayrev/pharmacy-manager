import { app } from "./app";
import { DependencyInjection } from "./base";
import { setupLoggers, setupPageRenderer } from "./helpers";
import { BackendService } from "./services/BackendService";
import { DateFormatter } from "./services/DateFormatter";
import { LogManager } from "./services/LogManager";
import { PageRenderer } from "./services/PageRenderer";
import { IBackendService, IDateFormatter, ILogManager, IPageRenderer } from "./types";

const DependencyInjectionInstance = DependencyInjection.getInstance(console.log);
app(() => {
  DependencyInjectionInstance.registerService<ILogManager>("ILogManager", "singleton", LogManager, []);
  const logManager = DependencyInjectionInstance.getService<ILogManager>("ILogManager");
  setupLoggers(logManager);
  DependencyInjectionInstance.registerService<IBackendService>("IBackendService", "singleton", BackendService, [window.pharmacyManagerConfiguration.baseApiUrl]);
  DependencyInjectionInstance.registerService<IPageRenderer>("IPageRenderer", "singleton", PageRenderer, [logManager.getLogger("PageRenderer")]);
  DependencyInjectionInstance.registerService<IDateFormatter>("IDateFormatter", "singleton", DateFormatter, []);
  setupPageRenderer(DependencyInjectionInstance);
}).run(DependencyInjectionInstance);