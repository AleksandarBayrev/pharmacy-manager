export type AddMedicineRequest = {
    name: string;
    manufacturer: string;
    description: string;
    manufacturingDate: Date;
    expirationDate: Date;
    price: string;
    quantity: string;
}