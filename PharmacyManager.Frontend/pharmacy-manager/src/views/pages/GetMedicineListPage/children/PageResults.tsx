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
                    this.props.store,
                    this.props.appStore,
                    this.props.translationManager
                )}
            </div>
        )
    }

    private renderLoaderOrData(
        medicines: MedicineModel[],
        dateFormatter: IDateFormatter,
        store: IGetMedicineListPageStore,
        appStore: IAppStore,
        translationManager: ITranslationManager
    ) {
        return (
            store.loadingData.get() ? <LoadingData rerenderDotsInMs={100} appStore={this.props.appStore} translationManager={this.props.translationManager} />
                :
                this.renderMedicines(
                    medicines,
                    dateFormatter,
                    store,
                    appStore,
                    translationManager
                )
        )
    }

    private renderMedicines(
        medicines: MedicineModel[],
        dateFormatter: IDateFormatter,
        store: IGetMedicineListPageStore,
        appStore: IAppStore,
        translationManager: ITranslationManager
    ) {
        return (
            !store.isInitialRequestMade.get() ? <div className='no-results'>{translationManager.getTranslation(appStore.language.get(), "RESULTS_MAKE_QUERY")}</div>
                :
                !medicines.length ?
                    store.fetchingError.get() ?
                        <div className='no-results'>{translationManager.getTranslation(appStore.language.get(), "RESULTS_FAILED_FETCHING")}</div>
                        :
                        <div className='no-results'>{translationManager.getTranslation(appStore.language.get(), "RESULTS_NO_RESULTS_FOR_QUERY")}</div>
                        :                
                        <>
                            {store.isLoadingPage.get() ? <LoadingPage appStore={appStore} rerenderDotsInMs={500} pageNumber={store.request.page} translationManager={translationManager} /> : <></>}
                            {store.additionalMessage.get()}
                            <MedicinesWrapper
                                dateFormatter={dateFormatter}
                                store={store}
                                medicines={medicines}
                                pages={store.pages.get()}
                                currentPage={store.request.page} />
                        </>
        )
    }
}