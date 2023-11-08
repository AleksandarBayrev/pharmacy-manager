import { IObservableValue, action, computed, observable } from "mobx";
import { enhanceClass } from "../base/enhanceClass";
import { IBackendService, IUpdateMedicinePageStore, UpdateMedicineRequest } from "../types";

class UpdateMedicinePageStore implements IUpdateMedicinePageStore {
    @observable
    public request: UpdateMedicineRequest;
    
    @observable
    public isLoadingMedicine: IObservableValue<boolean>;

    @observable
    public isUpdatingMedicine: IObservableValue<boolean>;

    @observable
    public medicineExists: IObservableValue<boolean>;
    
    @observable
    public isRequestSuccessful: IObservableValue<boolean | undefined>;
    
    
    private readonly backendService: IBackendService;

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
        this.isLoadingMedicine = observable.box(true);
        this.medicineExists = observable.box(false);
        this.request = observable({ ...this.defaultRequest });
        this.isUpdatingMedicine = observable.box(false);
        this.isRequestSuccessful = observable.box(undefined);
    }

    @action
    load = async () => {
        var medicine = await this.backendService.getMedicine(this.request.id);
        this.isLoadingMedicine.set(false);
        if (medicine == null) {
            this.medicineExists.set(false);
            return;
        }
        this.updateRequest({
            id: medicine.id,
            name: medicine.name,
            description: medicine.description,
            manufacturer: medicine.manufacturer,
            expirationDate: new Date(medicine.expirationDate),
            manufacturingDate: new Date(medicine.manufacturingDate),
            price: medicine.price.toString(),
            quantity: medicine.quantity.toString()
        });
    }

    @action
    unload = async () => {
        this.resetRequestToDefault();
        this.isUpdatingMedicine.set(false);
        this.isRequestSuccessful.set(undefined);
    }

    @action
    updateMedicine = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            this.isUpdatingMedicine.set(true);
            var result = await this.backendService.updateMedicine({
                ...this.request
            });
            if (!result) {
                throw new Error("Medicine not updated!");
            }
            this.isUpdatingMedicine.set(false);
            this.isRequestSuccessful.set(true);
            this.resetMessage();
        } catch (_) {
            this.isUpdatingMedicine.set(false);
            this.isRequestSuccessful.set(false);
            this.resetMessage();
        }
    }

    @action
    resetMessage = () => {
        setTimeout(() => {
            this.isRequestSuccessful.set(undefined);
        }, 2000);
    }

    @action
    resetRequestToDefault = () => {
        this.request.description = this.defaultRequest.description;
        this.request.expirationDate = this.defaultRequest.expirationDate;
        this.request.manufacturer = this.defaultRequest.manufacturer;
        this.request.manufacturingDate = this.defaultRequest.manufacturingDate;
        this.request.name = this.defaultRequest.name;
        this.request.price = this.defaultRequest.price;
        this.request.quantity = this.defaultRequest.quantity;
    }

    @action
    updateRequest = (request: Partial<UpdateMedicineRequest>) => {
        this.request.name = request.name ?? this.request.name;
        this.request.manufacturer = request.manufacturer ?? this.request.manufacturer;
        this.request.description = request.description ?? this.request.description;
        this.request.expirationDate = request.expirationDate ?? this.request.expirationDate;
        this.request.manufacturingDate = request.manufacturingDate ?? this.request.manufacturingDate;
        this.request.price = request.price ?? this.request.price;
        this.request.quantity = request.quantity ?? this.request.quantity;
    }

    @computed
    private get defaultRequest(): UpdateMedicineRequest {
        const path = window.location.pathname.split('/');
        return {
            id: path[path.length-1],
            name: "",
            manufacturer: "",
            description: "",
            manufacturingDate: new Date(),
            expirationDate: new Date(),
            price: "",
            quantity: ""
        }
    }
}

enhanceClass(UpdateMedicinePageStore, "UpdateMedicinePageStore");

export { UpdateMedicinePageStore }