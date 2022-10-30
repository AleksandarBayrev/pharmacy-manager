declare interface Window {
    pharmacyManagerConfiguration: import('./types').PharmacyManagerConfiguration;
    loadBaseDependencies: () => Promise<void>;
    RenderPharmacyManager: (root: string, postSetup: (DI: any) => Promise<void>) => Promise<void>;
}