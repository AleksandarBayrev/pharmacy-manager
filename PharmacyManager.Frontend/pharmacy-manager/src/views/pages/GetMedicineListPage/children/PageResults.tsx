import React from "react";
import { observer } from "mobx-react";
import { IAppStore, IDateFormatter, IGetMedicineListPageStore, ITranslationManager, MedicineModel } from "../../../../types";
import { LoadingData } from "./pageComponents/LoadingData";
import { MedicinesWrapper } from "./pageComponents/MedicinesWrapper";
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
                {this.renderLoaderOrData(this.props.store.loadingData.get(), this.props.store.isInitialRequestMade.get(), this.props.store.medicines, this.props.dateFormatter, this.props.store, this.props.store.pages.get(), this.props.store.request.page)}
            </div>
        )
    }

    private renderLoaderOrData(loadingData: boolean,
        isInitialRequestMade: boolean,
        medicines: MedicineModel[],
        dateFormatter: IDateFormatter,
        store: IGetMedicineListPageStore,
        pages: number,
        page: number
    ) {
        return (
            loadingData ? <LoadingData rerenderDotsInMs={100} appStore={this.props.appStore} translationManager={this.props.translationManager} />
                :
                this.renderMedicines(
                    isInitialRequestMade,
                    medicines,
                    dateFormatter,
                    store,
                    pages,
                    page)
        )
    }

    private renderMedicines(
        isInitialRequestMade: boolean,
        medicines: MedicineModel[],
        dateFormatter: IDateFormatter,
        store: IGetMedicineListPageStore,
        pages: number,
        page: number
    ) {
        return (
            !isInitialRequestMade ? <div className='no-results'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "RESULTS_MAKE_QUERY")}</div>
                :
                !medicines.length ? <div className='no-results'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "RESULTS_NO_RESULTS_FOR_QUERY")}</div> :
                    <MedicinesWrapper
                        dateFormatter={dateFormatter}
                        store={store}
                        medicines={medicines}
                        pages={pages}
                        currentPage={page} />
        )
    }
}