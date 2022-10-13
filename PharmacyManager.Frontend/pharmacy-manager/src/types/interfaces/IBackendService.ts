import { AddMedicineRequest, MedicineModel } from "../models";
import { MedicineRequest } from "../requests";
import { MedicineResponse, PageCalculationsResponse } from "../responses";

export interface IBackendService {
    addMedicine: (request: AddMedicineRequest) => Promise<MedicineModel | undefined>;
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse>;
    getInitialPageCalculations(request: MedicineRequest): Promise<PageCalculationsResponse>;
}