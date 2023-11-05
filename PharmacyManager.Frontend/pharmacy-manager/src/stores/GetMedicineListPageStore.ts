import { action, computed, observable, IObservableValue, IObservableArray, runInAction } from "mobx";
import { enhanceClass } from "../base/enhanceClass";
import { MedicineModel, MedicineRequest } from "../types";
import { IBackendService, IGetMedicineListPageStore } from "../types/interfaces";
import { dropdownOptions } from "../constants";

class GetMedicineListPageStore implements IGetMedicineListPageStore {
    @observable
    public request: MedicineRequest;

    @observable
    public medicines: IObservableArray<MedicineModel>;

    @observable
    public pages: IObservableValue<number>;

    @observable
    public loadingData: IObservableValue<boolean>;

    @observable
    public isLoadingPage: IObservableValue<boolean>;

    @observable
    public isInitialRequestMade: IObservableValue<boolean>;

    @observable
    public showPageCount: IObservableValue<boolean>;

    @observable
    public additionalMessage: IObservableValue<string>;


    private updateInterval: NodeJS.Timeout | undefined = undefined;
    private loadDataTimeout: NodeJS.Timeout | undefined = undefined;
    private readonly loadingTimeout: number = 1000;
    private readonly backendService: IBackendService;
    private url: URL = new URL(window.location.href);

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
        this.request = observable({ ...this.defaultRequest });
        this.medicines = observable([]);
        this.pages = observable.box(1);
        this.loadingData = observable.box(false);
        this.isLoadingPage = observable.box(false);
        this.isInitialRequestMade = observable.box(false);
        this.showPageCount = observable.box(false);
        this.additionalMessage = observable.box("");
    }

    deleteMedicine = async (medicineId: string): Promise<void> => {
        try {
            var result = await this.backendService.deleteMedicine(medicineId);
            if (result.deleted) {
                this.additionalMessage.set(`Medicine ID ${medicineId} deleted successfully!`);
            }
            if (result.error) {
                throw new Error(`Failed deleting medicine ID ${medicineId}`);
            }
        } catch (err) {
            this.additionalMessage.set((err as Error).message);
        } finally {
            setTimeout(() => this.additionalMessage.set(""), 5000);
        }
    }

    @action
    load = async () => {
        this.url = new URL(window.location.href);
        this.updateRequestProperties(this.buildRequestFromURL());
        this.loadingData.set(true);
        const pageCalculations = await this.backendService.getInitialPageCalculations(this.request);
        this.pages.set(pageCalculations.pages);
        this.showPageCount.set(true);
        await this.getMedicines(this.request, true);
        this.updateCurrentRequest();
    }

    @action
    unload = async () => {
        clearTimeout(this.loadDataTimeout);
        this.resetRequestToDefaults(false, false);
        this.stopUpdateInterval();
        this.medicines.replace([]);
        this.pages.set(1);
        this.loadingData.set(false);
        this.isInitialRequestMade.set(false);
        this.showPageCount.set(false); 
    }

    @computed
    public readonly defaultRequest: MedicineRequest = {
        availableOnly: false,
        notExpired: false,
        manufacturer: '',
        page: 1,
        itemsPerPage: dropdownOptions[0]
    };

    @action
    public updateCurrentRequest = () => {
        if (!this.updateInterval) {
            this.updateInterval = setInterval(() => {
                this.getMedicines(this.request, false);
            }, 1000);
        }
    }

    @action
    public stopUpdateInterval = () => {
        clearInterval(this.updateInterval);
        this.updateInterval = undefined;
    }

    @action
    public resetUpdateInterval = () => {
        this.stopUpdateInterval();
        this.updateCurrentRequest();
    }

    @action
    public getMedicines = async (request: MedicineRequest, useLoadingTimeout: boolean) => {
        if (useLoadingTimeout) {
            this.loadingData.set(true);
            this.isInitialRequestMade.set(true);
            this.showPageCount.set(false);
        }

        const response = await this.backendService.getAllMedicines(request);
        const timeout = useLoadingTimeout ? this.loadingTimeout : 0;
        setTimeout(() => {
            runInAction(() => {
                this.medicines.replace(response.medicines);
                this.pages.set(response.pages);
                this.loadingData.set(false);
                this.showPageCount.set(true);
            });
        }, timeout);
    }


    @action
    public updateRequestProperties = (request: Partial<MedicineRequest>) => {
        this.request.availableOnly = request.availableOnly ?? this.request.availableOnly;
        this.request.itemsPerPage = request.itemsPerPage ?? this.request.itemsPerPage;
        this.request.manufacturer = request.manufacturer ?? this.request.manufacturer;
        this.request.notExpired = request.notExpired ?? this.request.notExpired;
        this.request.page = request.page ?? this.request.page;
        this.updateURL();
    }

    @action
    public refetch = (shouldWait: boolean) => {
        if (shouldWait) {
            clearTimeout(this.loadDataTimeout);
            this.loadDataTimeout = setTimeout(() => {
                this.getMedicines(this.request, true).then(this.resetUpdateInterval);
            }, 500);
            return;
        }
        this.getMedicines(this.request, true).then(this.resetUpdateInterval);
    }

    @action
    public resetRequestToDefaults = (reloadData: boolean, shouldUpdateUrl: boolean) => {
        this.request.availableOnly = this.defaultRequest.availableOnly;
        this.request.itemsPerPage = this.defaultRequest.itemsPerPage;
        this.request.manufacturer = this.defaultRequest.manufacturer;
        this.request.notExpired = this.defaultRequest.notExpired;
        this.request.page = this.defaultRequest.page;
        if (shouldUpdateUrl) {
            this.updateURL();
        }
        if (reloadData) {
            this.getMedicines(this.request, true)
                .then(() => {
                    this.resetUpdateInterval();
                });
        }
    }

    private buildRequestFromURL = () => {
        return {
            manufacturer: this.url.searchParams.get('manufacturer') || '',
            page: parseInt(this.url.searchParams.get('page') || this.defaultRequest.page.toString()),
            notExpired: this.url.searchParams.get('notExpired') === "true",
            availableOnly: this.url.searchParams.get('availableOnly') === "true",
            itemsPerPage: parseInt(dropdownOptions.includes(parseInt(this.url.searchParams.get('itemsPerPage') || '0')) ? (this.url.searchParams.get('itemsPerPage') || this.defaultRequest.itemsPerPage).toString() : this.defaultRequest.itemsPerPage.toString())
        }
    }

    private updateURL = () => {
        if (this.request.manufacturer) {
            this.url.searchParams.set('manufacturer', this.request.manufacturer)
        } else {
            this.url.searchParams.delete('manufacturer');
        }
        this.url.searchParams.set('page', this.request.page.toString());
        this.url.searchParams.set('itemsPerPage', this.request.itemsPerPage.toString());
        this.url.searchParams.set('availableOnly', String(this.request.availableOnly));
        this.url.searchParams.set('notExpired', String(this.request.notExpired));
        window.history.replaceState({}, '', this.url.toString());
    }
}

enhanceClass(GetMedicineListPageStore, "GetMedicineListPageStore");

export { GetMedicineListPageStore }