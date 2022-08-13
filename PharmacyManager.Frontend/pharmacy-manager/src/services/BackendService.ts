import { IBackendService, MedicineRequest, MedicineResponse } from "../types";

export class BackendService implements IBackendService {
    private readonly baseUrl: string;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async getAllMedicines(request: MedicineRequest) {
        try {
            const result = await fetch(`${this.baseUrl}/api/medicines/getAllMedicines`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });
            return await result.json();
        } catch (err) {
            console.error(err);
        }
    }

}