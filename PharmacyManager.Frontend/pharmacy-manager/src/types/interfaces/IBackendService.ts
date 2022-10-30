import { AddMedicineRequest, MedicineModel } from "../models";
import { MedicineRequest } from "../requests";
import { MedicineResponse, PageCalculationsResponse, TranslationsResponse } from "../responses";

export interface IBackendService {
    addMedicine: (request: AddMedicineRequest) => Promise<MedicineModel | undefined>;
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse>;
    getInitialPageCalculations(request: MedicineRequest): Promise<PageCalculationsResponse>;
    getTranslations(): Promise<TranslationsResponse>;
    reloadTranslations(): Promise<TranslationsResponse>;
}