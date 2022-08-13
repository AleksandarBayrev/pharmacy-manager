import { ValidURL } from "../../types";

export const Pages: {[key: string]: ValidURL}= {
    Home: "/",
    GetMedicineList: "/medicines/get",
    AddMedicine: "/medicines/add",
    UpdateMedicine: "/medicines/update"
}