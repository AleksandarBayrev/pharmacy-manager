import React from "react";
import { IBackendService } from "../../../types";
import "../../Shared/Styles.css";

export type UpdateMedicinePageProps = {
    backendService: IBackendService;
}

export class UpdateMedicinePage extends React.Component<UpdateMedicinePageProps> {
    componentDidMount(): void {
        window.document.title = "Pharmacy Manager - Update Medicine";
    }
    render() {
        return (
            <div className="App-page">
                <div className="App-page-header">Update Medicine</div>
            </div>
        )
    }
}