import { app } from "./app";
import { DependencyInjection } from "./base";
import { setupLoggers, setupPageRenderer } from "./helpers";
import { BackendService } from "./services/BackendService";
import { DateFormatter } from "./services/DateFormatter";
import { LogManager } from "./services/LogManager";
import { PageRenderer } from "./services/PageRenderer";
import { TimeFormatter } from "./services/TimeFormatter";
import { IBackendService, IDateFormatter, ILogManager, IPageRenderer, ITimeFormatter } from "./types";

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
  setupPageRenderer(DependencyInjectionInstance);
}).run(DependencyInjection.getInstance());