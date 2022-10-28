window.pharmacyManagerConfiguration = (function () {
    return Object.freeze({
        baseApiUrl: window.location.origin,
        appLoadedEventName: "APP_LOADED",
        appDivId: "root",
        loaderDivId: "loader"
    });
})();
window.loadBaseDependencies = async function () {
};