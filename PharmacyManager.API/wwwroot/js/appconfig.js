window.pharmacyManagerConfiguration = (function () {
    return Object.freeze({
        baseApiUrl: window.location.origin,
        appLoadedEventName: "APP_LOADED",
        appDivId: "root",
        showLogo: true
    });
})();
window.loadBaseDependencies = async function () {
    // Use this function to extend the configuration for example on backend related stuff
};