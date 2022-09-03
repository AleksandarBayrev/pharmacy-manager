import { MedicineRequest } from "../requests";
import { MedicineResponse, PageCalculationsResponse } from "../responses";

export interface IBackendService {
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse>;
    getInitialPageCalculations(request: MedicineRequest): Promise<PageCalculationsResponse>;
}