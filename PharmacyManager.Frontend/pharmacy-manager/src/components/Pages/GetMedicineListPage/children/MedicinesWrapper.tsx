import React from "react";
import { IDateFormatter, MedicineModel } from "../../../../types";
import { Medicine } from "./Medicine";
import { Separator } from "./Separator";
import "./Style.css";


export type MedicinesWrapperProps = {
    dateFormatter: IDateFormatter;
    setPage: (page: number) => void;
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
                </div>
                <div className="Medicines-list">
                    {this.props.medicines.map(medicine => <Medicine medicine={medicine} dateFormatter={this.props.dateFormatter} />)}
                </div>
                <div className="Pagination">
                    {this.renderPages(this.props.setPage, this.props.currentPage, this.props.pages)}
                </div>
            </div>
        )
    }

    private renderPages(setPage: (page: number) => void, currentPage: number, maxPageCount: number) {
        const options: JSX.Element[] = [];
        if (maxPageCount < 20) {
            for (let i = 1; i <= maxPageCount; i++) {
                const option = <a className={this.getClasses(currentPage, i)} onClick={() => setPage(i)}>{i}</a>;
                options.push(option);
            }
            return options;
        }

        if (currentPage < 3) {
            for (let i = 1; i <= 3; i++) {
                options.push(<a className={this.getClasses(currentPage, i)} onClick={() => setPage(i)}>{i}</a>);
            }
            options.push(<>...</>);
        }

        if (currentPage < 3 && maxPageCount <= 3) {
            for (let i = 1; i <= maxPageCount; i++) {
                options.push(<a className={this.getClasses(currentPage, i)} onClick={() => setPage(i)}>{i}</a>);
            }
        }

        if (currentPage >= 3 && currentPage <= maxPageCount - 3) {
            if (currentPage - 2 > 1) {
                options.push(<>...</>);
            }
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                options.push(<a className={this.getClasses(currentPage, i)} onClick={() => setPage(i)}>{i}</a>);
            }
            options.push(<>...</>);
        }

        if (currentPage >= maxPageCount - 2 && currentPage <= maxPageCount) {
            options.push(<>...</>);
            for (let i = currentPage - 2; i <= maxPageCount; i++) {
                options.push(<a className={this.getClasses(currentPage, i)} onClick={() => setPage(i)}>{i}</a>);
            }
        }
        
        return options;
    }

    private getClasses(currentPage: number, page: number) {
        return `page-button hover${currentPage == page ? ' selected' : ''}`;
    }
}