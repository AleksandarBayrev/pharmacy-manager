import React from "react";
import { IBackendService } from "../../../types";
import "../../Shared/Style.css";

export type AddMedicinePageProps = {
    backendService: IBackendService;
}

export class AddMedicinePage extends React.Component<AddMedicinePageProps> {
    render(): React.ReactNode {
        return (
            <div className="App-page">
                <div className="App-page-header">Add Medicine</div>
            </div>
        )
    }
}