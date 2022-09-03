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