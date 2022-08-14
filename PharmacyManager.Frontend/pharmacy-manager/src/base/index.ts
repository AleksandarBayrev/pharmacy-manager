import { BackendService } from "../services/BackendService";
import { IBackendService } from "../types"

export type DI = {
    backendService: IBackendService;
}

export const DependencyInjection: DI = {
    backendService: new BackendService(window.pharmacyManagerConfiguration.baseApiUrl)
}