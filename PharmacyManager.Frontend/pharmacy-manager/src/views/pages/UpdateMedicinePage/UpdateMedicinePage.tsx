import React from "react";
import { IAppStore, IBackendService, IDateFormatter, ITranslationManager, IUpdateMedicinePageStore } from "../../../types";
import "../../../shared/Styles.css";
import { computed, Lambda, observe } from "mobx";
import { observer } from "mobx-react";

export type UpdateMedicinePageProps = {
    backendService: IBackendService;
    store: IUpdateMedicinePageStore;
    translationManager: ITranslationManager;
    dateFormatter: IDateFormatter;
    appStore: IAppStore;
}

@observer
export class UpdateMedicinePage extends React.Component<UpdateMedicinePageProps> {
    private dateFormatter: IDateFormatter;
    private pageTitleObserver!: Lambda;
    constructor(props: UpdateMedicinePageProps) {
        super(props);
        this.dateFormatter = props.dateFormatter;
    }
    componentDidMount = async () => {
        await this.props.appStore.load();
        this.props.appStore.setCurrentPage(window.location.pathname);
        this.pageTitleObserver = observe(this.props.appStore.language, () => {
            window.document.title = this.pageTitle;
        });
        window.document.title = this.pageTitle;
        await this.props.store.load();
    }
    componentWillUnmount = async() => {
        this.pageTitleObserver();
        await this.props.appStore.unload();
        await this.props.store.unload();
    }
    render(): React.ReactNode {
        return (
            <div className="App-page">
                <div className="App-page-header">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "HEADER_UPDATE_MEDICINE")}</div>
                <div className="form">
                    <div className="medicine-name">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_NAME")}</div>
                            <div className="column">
                                <input
                                    type="text"
                                    onChange={(e) => this.props.store.updateRequest({ name: e.target.value })}
                                    value={this.props.store.request.name}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="medicine-manufacturer">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_MANUFACTURER")}</div>
                            <div className="column">
                                <input
                                    type="text"
                                    onChange={(e) => this.props.store.updateRequest({ manufacturer: e.target.value })}
                                    value={this.props.store.request.manufacturer}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="medicine-description">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_DESCRIPTION")}</div>
                            <div className="column">
                                <input
                                    type="text"
                                    onChange={(e) => this.props.store.updateRequest({ description: e.target.value })}
                                    value={this.props.store.request.description}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="medicine-manufacturing-date">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_MANUFACTURING_DATE")}</div>
                            <div className="column">
                                <input
                                    type="date"
                                    onChange={(e) => this.props.store.updateRequest({ manufacturingDate: new Date(e.target.value) })}
                                    value={this.dateFormatter.getDateForInput(this.props.store.request.manufacturingDate)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="medicine-expiration-date">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_EXPIRATION_DATE")}</div>
                            <div className="column">
                                <input
                                    type="date"
                                    onChange={(e) => this.props.store.updateRequest({ expirationDate: new Date(e.target.value) })}
                                    value={this.dateFormatter.getDateForInput(this.props.store.request.expirationDate)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="medicine-price">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_PRICE")}</div>
                            <div className="column">
                                <input
                                    type="number"
                                    onChange={(e) => this.props.store.updateRequest({ price: e.target.value.toString() })}
                                    value={this.props.store.request.price}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="medicine-quantity">
                        <div className="row">
                            <div className="column">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_QUANTITY")}</div>
                            <div className="column">
                                <input
                                    type="number"
                                    onChange={(e) => this.props.store.updateRequest({ quantity: e.target.value.toString() })}
                                    value={this.props.store.request.quantity}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="submit-medicine">
                        <div className="row">
                            <div className="column">
                                <button
                                    onClick={this.props.store.updateMedicine}
                                    disabled={this.isInputInvalid() || this.props.store.isUpdatingMedicine.get()}
                                >
                                    {this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_UPDATE")}
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <button
                                    onClick={this.resetInput}
                                    disabled={this.props.store.isUpdatingMedicine.get()}
                                >
                                    {this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_UPDATE_RESET")}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="message">{this.renderRequestStatusMessage()}</div>
                </div>
            </div>
        )
    }

    @computed
    private get pageTitle() {
        return `Pharmacy Manager - ${this.props.translationManager.getTranslation(this.props.appStore.language.get(), "HEADER_UPDATE_MEDICINE")}`
    }

    private resetInput = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.props.store.resetRequestToDefault();
    }

    private renderRequestStatusMessage = () => {
        const successMessage = this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_UPDATE_SUCCESS");
        const errorMessage = this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_MEDICINE_UPDATE_FAILURE");
        return (this.props.store.isRequestSuccessful.get() !== undefined ?
            this.props.store.isRequestSuccessful.get() ?
                `${successMessage} ${this.props.store.request.name} (ID: ${this.props.store.request.id})`
                :
                `${errorMessage} ${this.props.store.request.name} (ID: ${this.props.store.request.id})`
            : ""
        );
    }

    private isInputInvalid = (): boolean => {
        const requestKeys = Object.keys(this.props.store.request);
        return requestKeys.filter(x => {
            const prop = (this.props.store.request as any)[x];
            return typeof prop !== "undefined" && (typeof prop === "string" ? prop.length : prop !== undefined || prop !== null)
        }).length !== requestKeys.length;
    };
}