import React from "react";
import { IBackendService } from "../../../types";
import "../../Shared/Styles.css";

export type AddMedicinePageProps = {
    backendService: IBackendService;
}

export class AddMedicinePage extends React.Component<AddMedicinePageProps> {
    componentDidMount(): void {
        window.document.title = "Pharmacy Manager - Add Medicine";
    }
    render(): React.ReactNode {
        return (
            <div className="App-page">
                <div className="App-page-header">Add Medicine</div>
            </div>
        )
    }
}