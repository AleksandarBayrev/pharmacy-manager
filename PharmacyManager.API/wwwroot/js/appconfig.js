window.pharmacyManagerUtils = {
    getActivePage: function () {
        const pages = Object.freeze({
            HomePage: "HomePage",
            GetMedicineListPage: "GetMedicineListPage",
            AddMedicinePage: "AddMedicinePage",
            UpdateMedicinePage: "UpdateMedicinePage"
        });

        let activePage = "HomePage";

        const locationString = window.location.href.toLowerCase();

        if (locationString.includes("getmedicine")) {
            activePage = "GetMedicineListPage";
        }

        if (locationString.includes("addmedicine")) {
            activePage = "AddMedicinePage"
        }

        if (locationString.includes("updatemedicine")) {
            activePage = "UpdateMedicinePage"
        }

        return pages[activePage] ?? pages.home;
    }
}

window.pharmacyManagerConfiguration = (function () {
    return Object.freeze({
        baseApiUrl: window.location.origin,
        activePage: pharmacyManagerUtils.getActivePage()
    });
})();