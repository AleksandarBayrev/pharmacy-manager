import React from "react";
import { IAppStore, IBackendService, ITranslationManager } from "../../../types";
import "../../../shared/Styles.css";
import { computed, Lambda, observe } from "mobx";
import { observer } from "mobx-react";

export type UpdateMedicinePageProps = {
    backendService: IBackendService;
    translationManager: ITranslationManager;
    appStore: IAppStore;
}

@observer
export class UpdateMedicinePage extends React.Component<UpdateMedicinePageProps> {
    private pageTitleObserver!: Lambda;
    
    componentDidMount = async () => {
        await this.props.appStore.load();
        this.props.appStore.setCurrentPage(window.location.pathname);
        this.pageTitleObserver = observe(this.props.appStore.language, () => {
            window.document.title = this.pageTitle;
        });
        window.document.title = this.pageTitle;
    }

    componentWillUnmount = async () => {
        this.pageTitleObserver();
        await this.props.appStore.unload();
    }

    render() {
        return (
            <div className="App-page">
                <div className="App-page-header">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "HEADER_UPDATE_MEDICINE")}</div>
            </div>
        )
    }

    @computed
    private get pageTitle() {
        return `Pharmacy Manager - ${this.props.translationManager.getTranslation(this.props.appStore.language.get(), "HEADER_UPDATE_MEDICINE")}`;
    }
}