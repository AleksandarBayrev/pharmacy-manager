export type MedicineRequest = {
    availableOnly: boolean;
    notExpired: boolean;
    manufacturer: string;
    itemsPerPage: number;
    page: number;
}

export type MedicineResponse = {
    id: number;
    manufacturer: string;
    name: string;
    description: string;
    manufacturingDate: Date;
    expirationDate: Date;
    price: number;
    quantity: number;
}

export type PharmacyManagerConfiguration = {
    baseApiUrl: string
}

export interface IBackendService {
    getAllMedicines: (request: MedicineRequest) => Promise<MedicineResponse[]>
}