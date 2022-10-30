import React from "react";
import { IAppStore, IBackendService } from "../../../types";
import "../../../shared/Styles.css";

export type UpdateMedicinePageProps = {
    backendService: IBackendService;
    appStore: IAppStore;
}

export class UpdateMedicinePage extends React.Component<UpdateMedicinePageProps> {
    componentDidMount(): void {
        this.props.appStore.setCurrentPage(window.location.pathname);
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