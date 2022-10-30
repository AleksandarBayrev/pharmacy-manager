import { setupLoadBaseDependencies } from "./setupLoadBaseDependencies";
import { setupPharmacyManagerConfiguration } from "./setupPharmacyManagerConfiguration";
(async () => {
    await setupPharmacyManagerConfiguration();
    await setupLoadBaseDependencies();
})();