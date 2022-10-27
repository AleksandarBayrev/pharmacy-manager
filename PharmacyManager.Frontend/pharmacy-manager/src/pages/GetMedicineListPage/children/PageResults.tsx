import React from "react";
import { observer } from "mobx-react";
import { IDateFormatter, IGetMedicineListPageStore, MedicineModel } from "../../../types";
import { LoadingData } from "./pageComponents/LoadingData";
import { MedicinesWrapper } from "./pageComponents/MedicinesWrapper";

export type PageResultsProps = {
    dateFormatter: IDateFormatter;
    store: IGetMedicineListPageStore;
}

@observer
export class PageResults extends React.Component<PageResultsProps> {
    async componentDidMount() {
        await this.props.store.load();
    }

    async componentWillUnmount() {
        await this.props.store.unload();
    }
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
            loadingData ? <LoadingData rerenderDotsInMs={100} />
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
            !isInitialRequestMade ? <div className='no-results'>Please make a query.</div>
                :
                !medicines.length ? <div className='no-results'>No results for given query</div> :
                    <MedicinesWrapper
                        dateFormatter={dateFormatter}
                        store={store}
                        medicines={medicines}
                        pages={pages}
                        currentPage={page} />
        )
    }
}