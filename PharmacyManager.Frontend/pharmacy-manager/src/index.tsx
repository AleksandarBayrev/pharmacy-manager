import { app } from "./app";
import { DependencyInjection } from "./base";
import { BackendService } from "./services/BackendService";
import { IBackendService } from "./types";

const DependencyInjectionInstance = DependencyInjection.getInstance(console.log);
app(() => {
  DependencyInjectionInstance.registerService<IBackendService>("IBackendService", "singleton", BackendService, [window.pharmacyManagerConfiguration.baseApiUrl]);
}).run(DependencyInjectionInstance);