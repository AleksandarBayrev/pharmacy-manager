import { MedicineRequest } from "../requests";
import { MedicineResponse } from "../responses";

export interface IBackendService {
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse>;
}