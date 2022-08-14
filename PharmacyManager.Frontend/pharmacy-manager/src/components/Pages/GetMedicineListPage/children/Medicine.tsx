import React from 'react';
import { MedicineModel } from '../../../../types';
import "./Style.css";

export type MedicineProps = {
    medicine: MedicineModel
};

export class Medicine extends React.Component<MedicineProps> {
    private separator() {
        return (
            <div className='column-separator'>|</div>
        )
    }
    render() {
        return (
            <div className={'Medicine-content'} key={`Medicine-${this.props.medicine.id}`}>
                <div className='row'>
                    <div className='column'>ID: {this.props.medicine.id}</div>
                    {this.separator()}
                    <div className='column'>Name: {this.props.medicine.name}</div>
                    {this.separator()}
                    <div className='column'>Description: {this.props.medicine.description}</div>
                    {this.separator()}
                    <div className='column'>Manufacturer: {this.props.medicine.manufacturer}</div>
                    {this.separator()}
                    <div className='column'>Manufacturing Date: {new Date(this.props.medicine.manufacturingDate).toDateString()}</div>
                    {this.separator()}
                    <div className='column'>Expiration Date: {new Date(this.props.medicine.expirationDate).toDateString()}</div>
                </div>
            </div>
        )
    }
}