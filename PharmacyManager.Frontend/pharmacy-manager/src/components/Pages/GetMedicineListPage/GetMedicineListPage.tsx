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
  showPageCount: boolean;
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
      isInitialRequestMade: false,
      showPageCount: false
    };
  }

  async componentDidMount() {
    window.document.title = "Pharmacy Manager - Get Medicines";
    const pageCalculations = await this.backendService.getInitialPageCalculations(this.state.request);
    this.setState({
      pages: pageCalculations.pages,
      showPageCount: true
    });
  }

  private async getMedicines(request: MedicineRequest) {
    this.setState({
      loadingData: true,
      isInitialRequestMade: true,
      showPageCount: false
    });
    const response = await this.backendService.getAllMedicines(request);
    setTimeout(() => {
      this.setState({
        medicines: response.medicines,
        pages: response.pages,
        loadingData: false,
        showPageCount: true
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
      !this.state.medicines.length ? <div className='no-results'>No results for given query</div> : <MedicinesWrapper setPage={this.setPageCallback} medicines={this.state.medicines} pages={this.state.pages} currentPage={this.state.request.page} />
    )
  }

  private setPageCallback = (page: number) => {
    if (page === this.state.request.page) {
      return;
    }
    this.updateRequest({page});
    setTimeout(async () => {
      const result = await this.backendService.getAllMedicines(this.state.request);
      this.setState({
        medicines: result.medicines,
        pages: result.pages
      });
    });
  }

  private renderLoaderOrData() {
    return (
      this.state.loadingData ? <LoadingData rerenderDotsInMs={100} />
      :
      this.renderMedicines()
    )
  }

  private renderPageCountText() {
    return this.state.showPageCount ? `Avaliable pages: ${this.state.pages}` : 'Loading page count...';
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
            <div className='column'><input readOnly={true} value={this.renderPageCountText()} /></div>
          </div>
        </div>
        <div className='App-page-results'>
          {this.renderLoaderOrData()}
        </div>
      </div>
    )
  }
}