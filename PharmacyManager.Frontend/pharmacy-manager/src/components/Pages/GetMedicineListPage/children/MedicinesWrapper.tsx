import React from "react";
import { MedicineModel } from "../../../../types";
import { Medicine } from "./Medicine";
import { Separator } from "./Separator";
import "./Style.css";


export type MedicinesWrapperProps = {
    medicines: MedicineModel[];
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
                </div>
                <div className="Medicines-list">
                    {this.props.medicines.map(medicine => <Medicine medicine={medicine} />)}
                </div>
            </div>
        )
    }
}