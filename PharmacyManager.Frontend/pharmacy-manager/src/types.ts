export type PageList = "HomePage" | "GetMedicineListPage" | "AddMedicinePage" | "UpdateMedicinePage";

export type MedicineRequest = {
    availableOnly: boolean;
    notExpired: boolean;
    manufacturer: string;
    itemsPerPage: number;
    page: number;
}

export type MedicineModel = {
    id: number;
    manufacturer: string;
    name: string;
    description: string;
    manufacturingDate: Date;
    expirationDate: Date;
    price: number;
    quantity: number;
}

export type MedicineResponse = {
    medicines: MedicineModel[];
    pages: number;
}

export type PharmacyManagerConfiguration = {
    baseApiUrl: string
}

export interface IBackendService {
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse>
}