import { enhanceClass } from "../base/enhanceClass";
import { AddMedicineRequest, IBackendService, MedicineModel, MedicineRequest, MedicineResponse, PageCalculationsResponse } from "../types";

class BackendService implements IBackendService {
    private readonly baseUrl: string;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
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
            console.error(err);
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
            console.error(err);
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