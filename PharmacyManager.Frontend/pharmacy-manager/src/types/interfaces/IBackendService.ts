import { MedicineModel } from "../models";
import { AddMedicineRequest, MedicineRequest, UpdateMedicineRequest } from "../requests";
import { DeleteMedicineResponse, MedicineResponse, PageCalculationsResponse, TranslationsResponse } from "../responses";

export interface IBackendService {
    addMedicine: (request: AddMedicineRequest) => Promise<MedicineModel | undefined>;
    updateMedicine: (request: UpdateMedicineRequest) => Promise<boolean>;
    getMedicine: (medicineId: string) => Promise<MedicineModel | null>;
    deleteMedicine: (medicineId: string) => Promise<DeleteMedicineResponse>;
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse>;
    getInitialPageCalculations(request: MedicineRequest): Promise<PageCalculationsResponse>;
    getTranslations(): Promise<TranslationsResponse>;
    reloadTranslations(): Promise<TranslationsResponse>;
}