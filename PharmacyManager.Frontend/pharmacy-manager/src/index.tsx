import { app } from "./app";
import { DependencyInjection } from "./base";
import { setupPageRenderer } from "./helpers";
import { BackendService } from "./services/BackendService";
import { PageRenderer } from "./services/PageRenderer";
import { IBackendService, IPageRenderer } from "./types";

const DependencyInjectionInstance = DependencyInjection.getInstance(console.log);
app(() => {
  DependencyInjectionInstance.registerService<IBackendService>("IBackendService", "singleton", BackendService, [window.pharmacyManagerConfiguration.baseApiUrl]);
  DependencyInjectionInstance.registerService<IPageRenderer>("IPageRenderer", "singleton", PageRenderer, []);
  setupPageRenderer(DependencyInjectionInstance);
}).run(DependencyInjectionInstance);