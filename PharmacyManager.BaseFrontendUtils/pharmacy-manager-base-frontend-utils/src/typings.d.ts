declare interface Window {
    pharmacyManagerConfiguration: import('./types').PharmacyManagerConfiguration;
    loadBaseDependencies: () => Promise<void>;
}