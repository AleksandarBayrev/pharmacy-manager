import React from "react";
import { MedicineModel } from "../../../../types";
import { Medicine } from "./Medicine";
import { Separator } from "./Separator";
import "./Style.css";


export type MedicinesWrapperProps = {
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
                    {this.props.medicines.map(medicine => <Medicine medicine={medicine} />)}
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
                const option = <a className={`hover${currentPage == i ? ' selected' : ''}`} onClick={() => setPage(i)}>{i}</a>;
                options.push(option);
            }
            return options;
        }

        if (currentPage < 3) {
            for (let i = 1; i <= 3; i++) {
                options.push(<a className={`hover${currentPage == i ? ' selected' : ''}`} onClick={() => setPage(i)}>{i}</a>);
            }
        }

        if (currentPage < 3 && maxPageCount <= 3) {
            for (let i = 1; i <= maxPageCount; i++) {
                options.push(<a className={`hover${currentPage == i ? ' selected' : ''}`} onClick={() => setPage(i)}>{i}</a>);
            }
        }

        if (currentPage >= 3 && currentPage + 2 <= maxPageCount) {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                options.push(<a className={`hover${currentPage == i ? ' selected' : ''}`} onClick={() => setPage(i)}>{i}</a>);
            }
        }
        
        return options;
    }
}