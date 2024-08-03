import { IObservableValue, Lambda, action, computed, observable, observe, runInAction } from "mobx";
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

    @observable
    public hasChanges: IObservableValue<boolean>;

    @observable
    private defaultRequest: UpdateMedicineRequest;
    
    
    private readonly backendService: IBackendService;

    private readonly observerLambdas: Lambda[] = [];

    constructor(backendService: IBackendService) {
        this.backendService = backendService;
        this.isLoadingMedicine = observable.box(true);
        this.medicineExists = observable.box(false);
        this.defaultRequest = observable(this.getDefaultRequest());
        this.request = observable({ ...this.defaultRequest });
        this.isUpdatingMedicine = observable.box(false);
        this.isRequestSuccessful = observable.box(undefined);
        this.hasChanges = observable.box(false);
    }

    load = () => {
        return Promise.resolve(runInAction(async () => {
            var medicine = await this.backendService.getMedicine(this.request.id);
            this.isLoadingMedicine.set(false);
            if (medicine == null) {
                this.medicineExists.set(false);
                return;
            }
            const update = {
                id: medicine.id,
                name: medicine.name,
                description: medicine.description,
                manufacturer: medicine.manufacturer,
                expirationDate: new Date(medicine.expirationDate),
                manufacturingDate: new Date(medicine.manufacturingDate),
                price: medicine.price.toString(),
                quantity: medicine.quantity.toString()
            };
            this.updateDefaultRequest(update);
            this.updateRequest(update);
            this.observerLambdas.push(observe(this.request, (change) => {
                this.hasChanges.set(this.computeHasChanges());
            }));
            this.observerLambdas.push(observe(this.defaultRequest, (change) => {
                this.hasChanges.set(this.computeHasChanges());
            }));
        }));
    }

    unload = () => {
        return Promise.resolve(runInAction(() => {
            this.resetRequestToDefault();
            this.observerLambdas.map(x => x());
            while (this.observerLambdas.length) {
                this.observerLambdas.pop();
            }
            this.isUpdatingMedicine.set(false);
            this.isRequestSuccessful.set(undefined);
        }));
    }

    updateMedicine = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        runInAction(async () => {
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
        });
    }

    resetMessage = () => {
        setTimeout(() => {
            runInAction(() => {
                this.isRequestSuccessful.set(undefined);
            });
        }, 2000);
    }

    resetRequestToDefault = () => {
        runInAction(() => {
            this.request.description = this.defaultRequest.description;
            this.request.expirationDate = this.defaultRequest.expirationDate;
            this.request.manufacturer = this.defaultRequest.manufacturer;
            this.request.manufacturingDate = this.defaultRequest.manufacturingDate;
            this.request.name = this.defaultRequest.name;
            this.request.price = this.defaultRequest.price;
            this.request.quantity = this.defaultRequest.quantity;
        });
    }

    updateRequest = (request: Partial<UpdateMedicineRequest>) => {
        runInAction(() => {
            this.request.name = request.name ?? this.request.name;
            this.request.manufacturer = request.manufacturer ?? this.request.manufacturer;
            this.request.description = request.description ?? this.request.description;
            this.request.expirationDate = request.expirationDate ?? this.request.expirationDate;
            this.request.manufacturingDate = request.manufacturingDate ?? this.request.manufacturingDate;
            this.request.price = request.price ?? this.request.price;
            this.request.quantity = request.quantity ?? this.request.quantity;
        });
    }

    private updateDefaultRequest = (request: Partial<UpdateMedicineRequest>) => {
        runInAction(() => {
            this.defaultRequest.id = request.id ?? this.defaultRequest.id;
            this.defaultRequest.name = request.name ?? this.defaultRequest.name;
            this.defaultRequest.manufacturer = request.manufacturer ?? this.defaultRequest.manufacturer;
            this.defaultRequest.description = request.description ?? this.defaultRequest.description;
            this.defaultRequest.expirationDate = request.expirationDate ?? this.defaultRequest.expirationDate;
            this.defaultRequest.manufacturingDate = request.manufacturingDate ?? this.defaultRequest.manufacturingDate;
            this.defaultRequest.price = request.price ?? this.defaultRequest.price;
            this.defaultRequest.quantity = request.quantity ?? this.defaultRequest.quantity;
        });
    }

    private computeHasChanges = () => {
        return Object.keys(this.defaultRequest).map((x) => this.defaultRequest[x as keyof UpdateMedicineRequest] !== this.request[x as keyof UpdateMedicineRequest]).filter(x => x).length !== 0;
    }

    private getDefaultRequest(): UpdateMedicineRequest {
        const path = window.location.pathname.split('/');
        return {
            id: path[path.length - 1],
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