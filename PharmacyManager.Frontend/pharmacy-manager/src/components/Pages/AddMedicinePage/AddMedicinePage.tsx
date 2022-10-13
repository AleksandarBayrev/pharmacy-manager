import React from "react";
import { IBackendService, AddMedicineRequest } from "../../../types";
import "../../Shared/Styles.css";

export type AddMedicinePageProps = {
    backendService: IBackendService;
}

export type AddMedicinePageState = {
    request: AddMedicineRequest;
    isAddingMedicine: boolean;
}

export class AddMedicinePage extends React.Component<AddMedicinePageProps, AddMedicinePageState> {
    private backendService: IBackendService;
    constructor(props: AddMedicinePageProps) {
        super(props);
        this.backendService = props.backendService;
        this.state = {
            request: this.getDefaultMedicine(),
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
                    <div className="medicine-name"><input type="text" onChange={(e) => this.setMedicine({name: e.target.value})} placeholder="Medicine Name" /></div>
                    <div className="medicine-name"><input type="text" onChange={(e) => this.setMedicine({manufacturer: e.target.value})} placeholder="Medicine Manufacturer" /></div>
                    <div className="medicine-name"><input type="text" onChange={(e) => this.setMedicine({description: e.target.value})} placeholder="Medicine Description" /></div>
                    <div className="submit-medicine"><button onClick={(e) => this.addMedicine()}>Add Medicine</button></div>
                </div>
            </div>
        )
    }

    private addMedicine = async () => {
        try {
            this.setState({
                isAddingMedicine: true
            });
            await this.backendService.addMedicine({
                ...this.state.request
            });
            this.setState({
                isAddingMedicine: false
            });
        } catch(_) {

        }
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

    private getDefaultMedicine(): AddMedicineRequest {
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