import React from "react";
import { IBackendService, AddMedicineRequest } from "../../../types";
import "../../Shared/Styles.css";

export type AddMedicinePageProps = {
    backendService: IBackendService;
}

export type AddMedicinePageState = {
    request: AddMedicineRequest;
    isAddingMedicine: boolean;
    isRequestSuccessful?: boolean;
}

export class AddMedicinePage extends React.Component<AddMedicinePageProps, AddMedicinePageState> {
    private backendService: IBackendService;
    constructor(props: AddMedicinePageProps) {
        super(props);
        this.backendService = props.backendService;
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
                    <div className="medicine-name"><input type="text" onChange={(e) => this.setMedicine({name: e.target.value})} placeholder="Medicine Name" value={this.state.request.name}/></div>
                    <div className="medicine-manufacturer"><input type="text" onChange={(e) => this.setMedicine({manufacturer: e.target.value})} placeholder="Medicine Manufacturer" value={this.state.request.manufacturer} /></div>
                    <div className="medicine-description"><input type="text" onChange={(e) => this.setMedicine({description: e.target.value})} placeholder="Medicine Description" value={this.state.request.description} /></div>
                    <div className="submit-medicine"><button onClick={this.addMedicine} disabled={this.isInputInvalid() || this.state.isAddingMedicine}>Add Medicine</button><button onClick={this.clearInput} disabled={this.state.isAddingMedicine}>Clear input</button></div>
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
        return requestKeys.filter(x => (this.state.request as any)[x] !== undefined && (this.state.request as any)[x].length).length !== requestKeys.length;
    };

    private addMedicine = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            this.setState({
                isAddingMedicine: true
            });
            await this.backendService.addMedicine({
                ...this.state.request
            });
            this.setState({
                isAddingMedicine: false,
                isRequestSuccessful: true
            });
            this.resetMessage();
        } catch(_) {
            this.setState({
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
            //price: 0,
            //quantity: 0
        }
    }
}