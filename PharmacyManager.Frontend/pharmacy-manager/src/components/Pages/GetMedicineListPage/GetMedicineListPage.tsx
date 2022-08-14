import React from 'react';
import { IBackendService, MedicineModel, MedicineRequest } from '../../../types';
import "../../Shared/Styles.css";
import { MedicinesWrapper } from './children/MedicinesWrapper';

export type GetMedicineListPageProps = {
  backendService: IBackendService;
}

export type GetMedicineListPageState = {
  request: MedicineRequest;
  medicines: MedicineModel[];
  pages: number;
  loadingData: boolean;
  isInitialRequestMade: boolean;
}

export class GetMedicineListPage extends React.Component<GetMedicineListPageProps, GetMedicineListPageState> {
  private readonly backendService: IBackendService;
  private readonly loadingTimeout: number = 1000;
  private readonly defaultRequest: MedicineRequest = {
    availableOnly: false,
    notExpired: false,
    manufacturer: '',
    page: 1,
    itemsPerPage: 10
  };

  constructor(props: GetMedicineListPageProps) {
    super(props);
    this.backendService = props.backendService;
    this.state = {
      request: { ...this.defaultRequest },
      medicines: [],
      pages: 1,
      loadingData: false,
      isInitialRequestMade: false
    };
  }

  private async getMedicines(request: MedicineRequest) {
    this.setState({
      loadingData: true,
      isInitialRequestMade: true
    });
    const response = await this.backendService.getAllMedicines(request);
    setTimeout(() => {
      this.setState({
        medicines: response.medicines,
        pages: response.pages,
        loadingData: false
      });
    }, this.loadingTimeout);
  }

  private updateRequest(request: Partial<MedicineRequest>) {
    this.setState({
      request: {
        ...this.state.request,
        ...request
      }
    });
  }

  private resetRequestToDefaults() {
    this.setState({
      request: { ...this.defaultRequest }
    });
  }

  private renderMedicines() {
    return (
      !this.state.isInitialRequestMade ? <div className='no-results'>Please make a query.</div>
      :
      !this.state.medicines.length ? <div className='no-results'>No results for given query</div> : <MedicinesWrapper medicines={this.state.medicines} />
    )
  }

  private renderLoaderOrData() {
    return (
      this.state.loadingData ? <div className='App-data-loading'>Loading data, please wait...</div>
      :
      this.renderMedicines()
    )
  }
  render() {
    return (
      <div className='App-page'>
        <input type="text" onChange={(e) => this.updateRequest({ page: parseInt(e.target.value) })} placeholder={'Page'} value={this.state.request.page} />
        <input type="text" onChange={(e) => this.updateRequest({ itemsPerPage: parseInt(e.target.value) })} placeholder={'Items Per Page'} value={this.state.request.itemsPerPage} />
        <input type="text" onChange={(e) => this.updateRequest({ manufacturer: e.target.value })} placeholder={'Manufacturer'} value={this.state.request.manufacturer} />
        <button onClick={async () => await this.getMedicines(this.state.request)} disabled={this.state.loadingData}>Get medicines</button>
        <button onClick={() => this.resetRequestToDefaults()} disabled={this.state.loadingData}>Reset to default request</button>
        <input readOnly={true} value={`Avaliable pages: ${this.state.pages}`} />
        {this.renderLoaderOrData()}
      </div>
    )
  }
}