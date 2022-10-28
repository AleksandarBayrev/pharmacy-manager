import { observer } from "mobx-react";
import React from "react";
import { IDateFormatter, IAddMedicinePageStore } from "../../../types";
import "../../../shared/Styles.css";

export type AddMedicinePageProps = {
    dateFormatter: IDateFormatter;
    store: IAddMedicinePageStore;
}

@observer
export class AddMedicinePage extends React.Component<AddMedicinePageProps> {
    private dateFormatter: IDateFormatter;
    constructor(props: AddMedicinePageProps) {
        super(props);
        this.dateFormatter = props.dateFormatter;
    }
    async componentDidMount() {
        window.document.title = "Pharmacy Manager - Add Medicine";
        await this.props.store.load();
    }
    async componentWillUnmount() {
        await this.props.store.unload();
    }
    render(): React.ReactNode {
        return (
            <div className="App-page">
                <div className="App-page-header">Add Medicine</div>
                <div className="form">
                    <div className="medicine-name">
                        <div className="row">
                            <div className="column">Medicine Name</div>
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
                            <div className="column">Medicine Manufacturer</div>
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
                            <div className="column">Medicine Description</div>
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
                            <div className="column">Medicine Manufacturing Date</div>
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
                            <div className="column">Medicine Expiration Date</div>
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
                            <div className="column">Price</div>
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
                            <div className="column">Quantity</div>
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
                                    onClick={this.props.store.addMedicine}
                                    disabled={this.isInputInvalid() || this.props.store.isAddingMedicine.get()}
                                >
                                    Add Medicine
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <button
                                    onClick={this.clearInput}
                                    disabled={this.props.store.isAddingMedicine.get()}
                                >
                                    Clear input
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="message">{this.renderRequestStatusMessage()}</div>
                </div>
            </div>
        )
    }

    private clearInput = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.props.store.resetRequestToDefault();
    }

    private renderRequestStatusMessage = () => {
        return (this.props.store.isRequestSuccessful.get() !== undefined ?
            this.props.store.isRequestSuccessful.get() ?
                `Successfully added medicine ${this.props.store.request.name}`
                :
                `Failed adding medicine ${this.props.store.request.name}`
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