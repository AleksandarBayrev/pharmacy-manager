import React from 'react';
import { MedicineModel } from '../../../../types';
import { Separator } from './Separator';
import "./Style.css";

export type MedicineProps = {
    medicine: MedicineModel
};

export class Medicine extends React.Component<MedicineProps> {
    render() {
        return (
            <div className={'Medicine-content'} key={`Medicine-${this.props.medicine.id}`}>
                <div className='row'>
                    <div className='column'>{this.props.medicine.id}</div>
                    <Separator />
                    <div className='column'>{this.props.medicine.name}</div>
                    <Separator />
                    <div className='column'>{this.props.medicine.description}</div>
                    <Separator />
                    <div className='column'>{this.props.medicine.manufacturer}</div>
                    <Separator />
                    <div className='column'>{new Date(this.props.medicine.manufacturingDate).toDateString()}</div>
                    <Separator />
                    <div className='column'>{new Date(this.props.medicine.expirationDate).toDateString()}</div>
                    <Separator />
                    <div className='column'>{this.props.medicine.price}</div>
                    <Separator />
                    <div className='column'>{this.props.medicine.quantity}</div>
                </div>
            </div>
        )
    }
}