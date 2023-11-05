import React from "react";
import { action } from "mobx";
import { IDateFormatter, IGetMedicineListPageStore, MedicineModel } from "../../../../../types";
import { Medicine } from "./Medicine";
import { Separator } from "./Separator";
import "./Style.css";


export type MedicinesWrapperProps = {
    dateFormatter: IDateFormatter;
    store: IGetMedicineListPageStore;
    medicines: MedicineModel[];
    pages: number;
    currentPage: number;
}

export class MedicinesWrapper extends React.Component<MedicinesWrapperProps> {
    render() {
        return (
            <div className="Medicine-header">
                <div className='row-headers'>
                    <div className='row-header'>ID</div>
                    <Separator />
                    <div className='row-header'>Name</div>
                    <Separator />
                    <div className='row-header'>Description</div>
                    <Separator />
                    <div className='row-header'>Manufacturer</div>
                    <Separator />
                    <div className='row-header'>Manufacturing Date</div>
                    <Separator />
                    <div className='row-header'>Expiration Date</div>
                    <Separator />
                    <div className='row-header'>Price</div>
                    <Separator />
                    <div className='row-header'>Quantity</div>
                    <Separator />
                    <div className='row-header'>Delete</div>
                </div>
                <div className="Medicines-list">
                    {this.props.medicines.map(medicine => <Medicine medicine={medicine} dateFormatter={this.props.dateFormatter} store={this.props.store} />)}
                </div>
                <div className="Pagination">
                    {this.renderPages(this.props.currentPage, this.props.pages, this.props.store.isLoadingPage.get())}
                </div>
            </div>
        )
    }

    @action.bound
    private setPage(page: number) {
        this.props.store.updateRequestProperties({
            page
        });
        this.props.store.isLoadingPage.set(true);
        this.props.store.updateCurrentRequest();
        setTimeout(() => {
            this.props.store.isLoadingPage.set(false);
        }, 1000);
    }

    private renderPages(currentPage: number, maxPageCount: number, isLoadingPage: boolean) {
        const options: JSX.Element[] = [];
        if (maxPageCount < 20) {
            for (let i = 1; i <= maxPageCount; i++) {
                const option = <a className={this.getClasses(currentPage, i, isLoadingPage)} onClick={() => this.setPage(i)}>{i}</a>;
                options.push(option);
            }
            return options;
        }

        if (currentPage < 3) {
            for (let i = 1; i <= 3; i++) {
                options.push(<a className={this.getClasses(currentPage, i, isLoadingPage)} onClick={() => this.setPage(i)}>{i}</a>);
            }
            options.push(<>...</>);
        }

        if (currentPage < 3 && maxPageCount <= 3) {
            for (let i = 1; i <= maxPageCount; i++) {
                options.push(<a className={this.getClasses(currentPage, i, isLoadingPage)} onClick={() => this.setPage(i)}>{i}</a>);
            }
        }

        if (currentPage >= 3 && currentPage <= maxPageCount - 3) {
            if (currentPage - 2 > 1) {
                options.push(<>...</>);
            }
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                options.push(<a className={this.getClasses(currentPage, i, isLoadingPage)} onClick={() => this.setPage(i)}>{i}</a>);
            }
            options.push(<>...</>);
        }

        if (currentPage >= maxPageCount - 2 && currentPage <= maxPageCount) {
            options.push(<>...</>);
            for (let i = currentPage - 2; i <= maxPageCount; i++) {
                options.push(<a className={this.getClasses(currentPage, i, isLoadingPage)} onClick={() => this.setPage(i)}>{i}</a>);
            }
        }
        
        return options;
    }

    private getClasses(currentPage: number, page: number, isLoadingPage: boolean) {
        return `page-button hover${currentPage == page ? ' selected' : ''} ${isLoadingPage ? 'disabled' : ''}`;
    }
}