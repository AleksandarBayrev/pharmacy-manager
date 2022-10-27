import { IObservableValue, computed, observable, action } from "mobx";
import { AddMedicineRequest, IAddMedicinePageStore, IBackendService } from "../types";

export class AddMedicinePageStore implements IAddMedicinePageStore {
    @observable
    public request: AddMedicineRequest;
    
    @observable
    public isAddingMedicine: IObservableValue<boolean>;
    
    @observable
    public isRequestSuccessful: IObservableValue<boolean | undefined>;
    
    
    private readonly backendService: IBackendService;

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
        this.request = observable({ ...this.defaultRequest });
        this.isAddingMedicine = observable.box(false);
        this.isRequestSuccessful = observable.box(undefined);
    }

    @action
    load = async () => {

    }

    @action
    unload = async () => {
        this.resetRequestToDefault();
        this.isAddingMedicine.set(false);
        this.isRequestSuccessful.set(undefined);
    }

    @action
    addMedicine = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            this.isAddingMedicine.set(true);
            var result = await this.backendService.addMedicine({
                ...this.request
            });
            if (!result) {
                throw new Error("Medicine not added!");
            }
            this.isAddingMedicine.set(false);
            this.isRequestSuccessful.set(true);
            this.resetMessage();
        } catch (_) {
            this.isAddingMedicine.set(false);
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
    updateRequest = (request: Partial<AddMedicineRequest>) => {
        this.request.name = request.name ?? this.request.name;
        this.request.manufacturer = request.manufacturer ?? this.request.manufacturer;
        this.request.description = request.description ?? this.request.description;
        this.request.expirationDate = request.expirationDate ?? this.request.expirationDate;
        this.request.manufacturingDate = request.manufacturingDate ?? this.request.manufacturingDate;
        this.request.price = request.price ?? this.request.price;
        this.request.quantity = request.quantity ?? this.request.quantity;
    }
    @computed
    private get defaultRequest(): AddMedicineRequest {
        return {
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