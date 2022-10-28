declare interface Window {
    RenderPharmacyManager: (root: string) => void;
    pharmacyManagerConfiguration: import('./types').PharmacyManagerConfiguration;
}