declare interface Window {
    RenderPharmacyManager: (root: string, postSetup: (DI: DependencyInjection) => Promise<void>) => Promise<void>;
    pharmacyManagerConfiguration: import('./types').PharmacyManagerConfiguration;
}