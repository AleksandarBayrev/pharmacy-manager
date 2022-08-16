import { enhanceClass } from "../base/enhanceClass";
import { IBackendService, MedicineRequest, MedicineResponse } from "../types";

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

    private getHeaders(): HeadersInit {
        return {
            "Content-Type": "application/json"
        }
    }
}

enhanceClass(BackendService, "BackendService");

export { BackendService };