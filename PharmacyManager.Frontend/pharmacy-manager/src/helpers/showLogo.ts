const showLogoTimeout = 2000;
export const showLogo = async () => {
    if (window.pharmacyManagerConfiguration.showLogo) {
        await new Promise((res, rej) => {
            setTimeout(() => {
                res({});
            }, showLogoTimeout);
        });
    }
}