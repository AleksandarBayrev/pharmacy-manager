import { PharmacyManagerConfiguration } from "./types";

const getWindowManagerConfiguration = async (): Promise<PharmacyManagerConfiguration> => {
    return Object.freeze({
        baseApiUrl: window.location.origin,
        appLoadedEventName: "APP_LOADED",
        appDivId: "root",
        showLogo: true
    });
}

export const setupPharmacyManagerConfiguration = async () => {
    window.pharmacyManagerConfiguration = await getWindowManagerConfiguration();
}