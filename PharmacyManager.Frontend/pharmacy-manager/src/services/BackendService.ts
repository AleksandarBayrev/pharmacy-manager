import { enhanceClass } from "../base/enhanceClass";
import { IBackendService, MedicineRequest, MedicineResponse, PageCalculationsResponse } from "../types";

class BackendService implements IBackendService {
    private readonly baseUrl: string;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
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
            console.error(err);
            return {
                medicines: [],
                pages: 1
            }
        }
    }

    public async getInitialPageCalculations(request: MedicineRequest): Promise<PageCalculationsResponse> {
        try {
            const result = await fetch(`${this.baseUrl}/api/medicines/getAllMedicines`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(request)
            });
            return await result.json() as PageCalculationsResponse;
        } catch (err) {
            console.error(err);
            return {
                pages: 1,
                page: request.page,
                itemsPerPage: request.itemsPerPage
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