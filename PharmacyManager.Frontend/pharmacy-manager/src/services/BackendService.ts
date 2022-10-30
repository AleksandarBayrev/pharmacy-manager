import { enhanceClass } from "../base/enhanceClass";
import { AddMedicineRequest, IBackendService, ILogger, MedicineModel, MedicineRequest, MedicineResponse, PageCalculationsResponse, TranslationsResponse } from "../types";

class BackendService implements IBackendService {
    private readonly baseUrl: string;
    private readonly logger: ILogger;
    
    constructor(
        baseUrl: string,
        logger: ILogger) {
        this.baseUrl = baseUrl;
        this.logger = logger;
    }
    
    public async addMedicine(addMedicineRequest: AddMedicineRequest): Promise<MedicineModel | undefined> {
        try {
            const result = await fetch(`${this.baseUrl}/api/medicines/addMedicine`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(addMedicineRequest)
            });
            return await result.json() as MedicineModel;
        } catch (err) {
            this.logger.Error(err as Error);
            return;
        }
    }

    public async getAllMedicines(request: MedicineRequest): Promise<MedicineResponse> {
        try {
            const result = await fetch(`${this.baseUrl}/api/medicines/getAllMedicines`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(request)
            });
            return await result.json() as MedicineResponse;
        } catch (err) {
            this.logger.Error(err as Error);
            return {
                medicines: [],
                pages: 1
            }
        }
    }

    public async getInitialPageCalculations(request: MedicineRequest): Promise<PageCalculationsResponse> {
        try {
            const result = await fetch(`${this.baseUrl}/api/medicines/getInitialPageCalculations`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(request)
            });
            return await result.json() as PageCalculationsResponse;
        } catch (err) {
            this.logger.Error(err as Error);
            return {
                pages: 1,
                page: request.page,
                itemsPerPage: request.itemsPerPage
            }
        }
    }

    public async getTranslations(): Promise<TranslationsResponse> {
        try {
            const result = await fetch(`${this.baseUrl}/api/settings/translations`, {
                method: "GET",
                headers: this.getHeaders()
            });
            return await result.json() as TranslationsResponse;
        } catch (err) {
            this.logger.Warn("Translations not loaded, check backend!");
            this.logger.Error(err as Error);
            return {
                bg: {},
                en: {}
            }
        }
    }

    public async reloadTranslations(): Promise<TranslationsResponse> {
        try {
            const result = await fetch(`${this.baseUrl}/api/settings/reloadTranslations`, {
                method: "GET",
                headers: this.getHeaders()
            });
            return await result.json() as TranslationsResponse;
        } catch (err) {
            this.logger.Warn("Translations not reloaded, check backend!");
            this.logger.Error(err as Error);
            return {
                bg: {},
                en: {}
            }
        }
    }

    private getHeaders(): HeadersInit {
        return {
            "Content-Type": "application/json"
        }
    }
}

enhanceClass(BackendService, "BackendService");

export { BackendService };