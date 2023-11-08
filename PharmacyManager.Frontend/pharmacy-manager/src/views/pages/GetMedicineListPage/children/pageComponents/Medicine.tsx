import React from 'react';
import { IDateFormatter, IGetMedicineListPageStore, MedicineModel } from '../../../../../types';
import { Separator } from './Separator';
import "./Style.css";

export type MedicineProps = {
    dateFormatter: IDateFormatter;
    medicine: MedicineModel;
    store: IGetMedicineListPageStore;
};

export class Medicine extends React.Component<MedicineProps> {
    render() {
        return (
            <div className={'Medicine-content'} key={`Medicine-${this.props.medicine.id}`}>
                <div className='row'>
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.medicine.id}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.medicine.name}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.medicine.description}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.medicine.manufacturer}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.dateFormatter.getDateForTable(new Date(this.props.medicine.manufacturingDate))}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.dateFormatter.getDateForTable(new Date(this.props.medicine.expirationDate))}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.medicine.price}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}>{this.props.medicine.quantity}</div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}><button onClick={() => window.location.replace(`/medicines/update/${this.props.medicine.id}`)}>Update</button></div>
                    <Separator />
                    <div className={this.getClassNames(this.props.medicine)}><button onClick={() => this.props.store.deleteMedicine(this.props.medicine.id)}>Delete</button></div>
                </div>
            </div>
        )
    }

    private getClassNames = (medicine: MedicineModel) => {
        const classNames = ['column'];
        if (medicine.deleted) {
            classNames.push('column-deleted');
        }
        return classNames.join(" ").trim();
    }
}