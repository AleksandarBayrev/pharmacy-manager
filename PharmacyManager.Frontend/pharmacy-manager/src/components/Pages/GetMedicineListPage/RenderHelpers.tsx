import React from "react"
import { IDateFormatter, MedicineModel } from "../../../types"
import { ItemsPerPage } from "./children/ItemsPerPage"
import { LoadingData } from "./children/LoadingData"
import { MedicinesWrapper } from "./children/MedicinesWrapper"


export function renderLoaderOrData(loadingData: boolean,
    isInitialRequestMade: boolean,
    medicines: MedicineModel[],
    dateFormatter: IDateFormatter,
    setPageCallback: (page: number) => void,
    pages: number,
    page: number
) {
    return (
        loadingData ? <LoadingData rerenderDotsInMs={100} />
            :
            renderMedicines(
                isInitialRequestMade,
                medicines,
                dateFormatter,
                setPageCallback,
                pages,
                page)
    )
}

export function renderMedicines(
    isInitialRequestMade: boolean,
    medicines: MedicineModel[],
    dateFormatter: IDateFormatter,
    setPageCallback: (page: number) => void,
    pages: number,
    page: number
) {
    return (
        !isInitialRequestMade ? <div className='no-results'>Please make a query.</div>
            :
            !medicines.length ? <div className='no-results'>No results for given query</div> :
                <MedicinesWrapper
                    dateFormatter={dateFormatter}
                    setPage={setPageCallback}
                    medicines={medicines}
                    pages={pages}
                    currentPage={page} />
    )
}

export function getItemsPerPageComponent(
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    itemsPerPage: number,
    loadingData: boolean
) {
  const options: number[] = [10, 15, 20, 50, 100, 500];
  return <ItemsPerPage 
    options={options}
    onChangeHandler={onSelectChange}
    selectedOption={itemsPerPage}
    shouldDisable={loadingData} />;
}