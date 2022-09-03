import React from 'react';
import { IBackendService, MedicineModel, MedicineRequest } from '../../../types';
import "../../Shared/Styles.css";
import { LoadingData } from './children/LoadingData';
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
      this.state.loadingData ? <LoadingData />
      :
      this.renderMedicines()
    )
  }

  private clearSearchResults() {
    this.setState({
      medicines: [],
      isInitialRequestMade: false
    });
  }

  render() {
    return (
      <div className='App-page'>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><input id='only-available-medicines' type="checkbox" checked={this.state.request.availableOnly} onChange={(e) => this.updateRequest({ availableOnly: e.target.checked })} /></div>
            <label className='column' htmlFor='only-available-medicines'>Show only available medicines</label></div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><input id='only-not-expired-medicines' type="checkbox" checked={this.state.request.notExpired} onChange={(e) => this.updateRequest({ notExpired: e.target.checked })} /></div>
            <label className='column' htmlFor='only-not-expired-medicines'>Show only not expired medicines</label></div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>Page</div>
            <div className='column'><input type="text" onChange={(e) => this.updateRequest({ page: parseInt(e.target.value) })} placeholder={'Page'} value={this.state.request.page} /></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>Items Per Page</div>
            <div className='column'><input type="text" onChange={(e) => this.updateRequest({ itemsPerPage: parseInt(e.target.value) })} placeholder={'Items Per Page'} value={this.state.request.itemsPerPage} /></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>Manufacturer</div>
            <div className='column'><input type="text" onChange={(e) => this.updateRequest({ manufacturer: e.target.value })} placeholder={'Manufacturer'} value={this.state.request.manufacturer} /></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><button onClick={async () => await this.getMedicines(this.state.request)} disabled={this.state.loadingData}>Get medicines</button></div>
            <div className='column'><button onClick={() => this.resetRequestToDefaults()} disabled={this.state.loadingData}>Reset to default request</button></div>
            <div className='column'><button onClick={() => this.clearSearchResults()} disabled={this.state.loadingData}>Clear results</button></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><input readOnly={true} value={`Avaliable pages: ${this.state.pages}`} /></div>
          </div>
        </div>
        <div className='App-page-results'>
          {this.renderLoaderOrData()}
        </div>
      </div>
    )
  }
}