import { Pages } from "./types";

export const AppLoadedEvent = new Event(window.pharmacyManagerConfiguration.appLoadedEventName);
export const pages: Pages= {
    Home: "/",
    GetMedicinesList: "/medicines/get",
    AddMedicines: "/medicines/add",
    UpdateMedicines: "/medicines/update",
    Settings: "/settings"
}

export const dropdownOptions: number[] = [10, 15, 20, 50, 100, 500];