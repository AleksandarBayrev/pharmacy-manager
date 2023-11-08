import { MedicineModel } from "../models";

export type MedicineResponse = {
    medicines: MedicineModel[];
    totalCount: number;
    totalFilteredCount: number;
    pages: number;
    error?: boolean;
}