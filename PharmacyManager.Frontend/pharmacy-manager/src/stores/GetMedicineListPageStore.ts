import { action, computed, observable, IObservableValue, IObservableArray, runInAction } from "mobx";
import { enhanceClass } from "../base/enhanceClass";
import { MedicineModel, MedicineRequest } from "../types";
import { IBackendService, IGetMedicineListPageStore } from "../types/interfaces";

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


    private updateInterval: NodeJS.Timeout | undefined = undefined;
    private loadDataTimeout: NodeJS.Timeout | undefined = undefined;
    private readonly loadingTimeout: number = 1000;
    private readonly backendService: IBackendService;

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
        this.request = observable({ ...this.defaultRequest });
        this.medicines = observable([]);
        this.pages = observable.box(1);
        this.loadingData = observable.box(false);
        this.isLoadingPage = observable.box(false);
        this.isInitialRequestMade = observable.box(false);
        this.showPageCount = observable.box(false);
    }

    @action
    load = async () => {
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
        this.resetRequestToDefaults(false);
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
        itemsPerPage: 10
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
        } else {
            this.isLoadingPage.set(true);
        }
        const response = await this.backendService.getAllMedicines(request);
        const timeout = useLoadingTimeout ? this.loadingTimeout : 0;
        setTimeout(() => {
            runInAction(() => {
                this.medicines.replace(response.medicines);
                this.pages.set(response.pages);
                this.loadingData.set(false);
                this.showPageCount.set(true);
                this.isLoadingPage.set(false);
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
    public resetRequestToDefaults = (reloadData: boolean) => {
        this.request.availableOnly = this.defaultRequest.availableOnly;
        this.request.itemsPerPage = this.defaultRequest.itemsPerPage;
        this.request.manufacturer = this.defaultRequest.manufacturer;
        this.request.notExpired = this.defaultRequest.notExpired;
        this.request.page = this.defaultRequest.page;
        if (reloadData) {
            this.getMedicines(this.request, true)
                .then(() => {
                    this.resetUpdateInterval();
                });
        }
    }
}

enhanceClass(GetMedicineListPageStore, "GetMedicineListPageStore");

export { GetMedicineListPageStore }