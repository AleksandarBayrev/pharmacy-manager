import React from "react";
import { observer } from "mobx-react";
import { IAppStore, IDateFormatter, IGetMedicineListPageStore, ITranslationManager, MedicineModel } from "../../../../types";
import { LoadingData } from "./pageComponents/LoadingData";
import { MedicinesWrapper } from "./pageComponents/MedicinesWrapper";
import { LoadingPage } from "./pageComponents/LoadingPage";
/**
 * TODO: Refactor!!!
 */
export type PageResultsProps = {
    dateFormatter: IDateFormatter;
    store: IGetMedicineListPageStore;
    appStore: IAppStore;
    translationManager: ITranslationManager;
}

@observer
export class PageResults extends React.Component<PageResultsProps> {
    render() {
        return (
            <div className='App-page-results'>
                {this.renderLoaderOrData(
                    this.props.store.medicines,
                    this.props.dateFormatter,
                    this.props.store
                )}
            </div>
        )
    }

    private renderLoaderOrData(
        medicines: MedicineModel[],
        dateFormatter: IDateFormatter,
        store: IGetMedicineListPageStore
    ) {
        return (
            this.props.store.loadingData.get() ? <LoadingData rerenderDotsInMs={100} appStore={this.props.appStore} translationManager={this.props.translationManager} />
                :
                this.renderMedicines(
                    medicines,
                    dateFormatter,
                    this.props.store
                )
        )
    }

    private renderMedicines(
        medicines: MedicineModel[],
        dateFormatter: IDateFormatter,
        store: IGetMedicineListPageStore
    ) {
        return (
            !this.props.store.isInitialRequestMade.get() ? <div className='no-results'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "RESULTS_MAKE_QUERY")}</div>
                :
                !medicines.length ? <div className='no-results'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "RESULTS_NO_RESULTS_FOR_QUERY")}</div> :
                    <>
                        {this.props.store.isLoadingPage.get() ? <LoadingPage appStore={this.props.appStore} rerenderDotsInMs={500} pageNumber={this.props.store.request.page} translationManager={this.props.translationManager} /> : <></>}
                        <MedicinesWrapper
                            dateFormatter={dateFormatter}
                            store={store}
                            medicines={medicines}
                            pages={this.props.store.pages.get()}
                            currentPage={this.props.store.request.page} />
                    </>
        )
    }
}