import { MedicineModel } from "../models";

export type MedicineResponse = {
    medicines: MedicineModel[];
    pages: number;
}