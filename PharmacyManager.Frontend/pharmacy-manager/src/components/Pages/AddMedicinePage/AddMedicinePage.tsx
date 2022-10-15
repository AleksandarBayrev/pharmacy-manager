import React from "react";
import { IBackendService, AddMedicineRequest, IDateFormatter } from "../../../types";
import "../../Shared/Styles.css";

export type AddMedicinePageProps = {
    backendService: IBackendService;
    dateFormatter: IDateFormatter;
}

export type AddMedicinePageState = {
    request: AddMedicineRequest;
    isAddingMedicine: boolean;
    isRequestSuccessful?: boolean;
}

export class AddMedicinePage extends React.Component<AddMedicinePageProps, AddMedicinePageState> {
    private backendService: IBackendService;
    private dateFormatter: IDateFormatter;
    constructor(props: AddMedicinePageProps) {
        super(props);
        this.backendService = props.backendService;
        this.dateFormatter = props.dateFormatter;
        this.state = {
            request: this.getDefaultRequest(),
            isAddingMedicine: false
        };
    }
    componentDidMount(): void {
        window.document.title = "Pharmacy Manager - Add Medicine";
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
                                    onChange={(e) => this.setMedicine({ name: e.target.value })}
                                    value={this.state.request.name}
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
                                    onChange={(e) => this.setMedicine({ manufacturer: e.target.value })}
                                    value={this.state.request.manufacturer}
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
                                    onChange={(e) => this.setMedicine({ description: e.target.value })}
                                    value={this.state.request.description}
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
                                    onChange={(e) => this.setMedicine({ manufacturingDate: new Date(e.target.value) })}
                                    value={this.dateFormatter.getDateForInput(this.state.request.manufacturingDate)}
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
                                    onChange={(e) => this.setMedicine({ expirationDate: new Date(e.target.value) })}
                                    value={this.dateFormatter.getDateForInput(this.state.request.expirationDate)}
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
                                    onChange={(e) => this.setMedicine({ price: e.target.value.toString() })}
                                    value={this.state.request.price}
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
                                    onChange={(e) => this.setMedicine({ quantity: e.target.value.toString() })}
                                    value={this.state.request.quantity}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="submit-medicine">
                        <div className="row">
                            <div className="column">
                                <button
                                    onClick={this.addMedicine}
                                    disabled={this.isInputInvalid() || this.state.isAddingMedicine}
                                >
                                    Add Medicine
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <button
                                    className="column"
                                    onClick={this.clearInput}
                                    disabled={this.state.isAddingMedicine}
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
        this.setState({
            request: { ...this.getDefaultRequest() }
        });
    }

    private renderRequestStatusMessage = () => {
        return (this.state.isRequestSuccessful !== undefined ?
            this.state.isRequestSuccessful ?
                `Successfully added medicine ${this.state.request.name}`
                :
                `Failed adding medicine ${this.state.request.name}`
            : ""
        );
    }

    private isInputInvalid = (): boolean => {
        const requestKeys = Object.keys(this.state.request);
        return requestKeys.filter(x => {
            const prop = (this.state.request as any)[x];
            return typeof prop !== "undefined" && (typeof prop === "string" ? prop.length : prop !== undefined || prop !== null)
        }).length !== requestKeys.length;
    };

    private addMedicine = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            this.setState({
                isAddingMedicine: true
            });
            var result = await this.backendService.addMedicine({
                ...this.state.request
            });
            if (!result) {
                throw new Error("Medicine not added!");
            }
            this.setState({
                isAddingMedicine: false,
                isRequestSuccessful: true
            });
            this.resetMessage();
        } catch (_) {
            this.setState({
                isAddingMedicine: false,
                isRequestSuccessful: false
            });
            this.resetMessage();
        }
    }

    private resetMessage = () => {
        setTimeout(() => {
            this.setState({
                isRequestSuccessful: undefined
            });
        }, 2000);
    }

    private setMedicine = (request: Partial<AddMedicineRequest>) => {
        console.log(request);
        this.setState({
            request: {
                ...this.state.request,
                ...request
            }
        });
    }

    private getDefaultRequest(): AddMedicineRequest {
        return {
            //id: 0,
            name: "",
            manufacturer: "",
            //manufacturingDate: new Date(0,0,0),
            //expirationDate: new Date(0,0,0),
            description: "",
            manufacturingDate: new Date(),
            expirationDate: new Date(),
            price: "",
            quantity: ""
            //price: 0,
            //quantity: 0
        }
    }
}