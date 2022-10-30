(async () => {
    window.addEventListener(window.pharmacyManagerConfiguration.appLoadedEventName, function() {
        window.loadBaseDependencies().then(function () {
            window.RenderPharmacyManager(window.pharmacyManagerConfiguration.appDivId, async function (DI) {
                const appLogger = DI.getService("ILogManager").getLogger("App");
                appLogger.Info("Starting frontend application...");
            });
        });
    });
})();