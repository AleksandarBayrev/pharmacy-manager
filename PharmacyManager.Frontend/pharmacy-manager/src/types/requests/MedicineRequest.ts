export type MedicineRequest = {
    availableOnly: boolean;
    notExpired: boolean;
    manufacturer: string;
    itemsPerPage: number;
    page: number;
}