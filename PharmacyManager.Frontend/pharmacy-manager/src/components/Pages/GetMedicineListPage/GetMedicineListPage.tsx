import React from 'react';
import { IBackendService, IDateFormatter, MedicineModel, MedicineRequest } from '../../../types';
import "../../Shared/Styles.css";
import { ItemsPerPage } from './children/ItemsPerPage';
import { LoadingData } from './children/LoadingData';
import { MedicinesWrapper } from './children/MedicinesWrapper';
import { getItemsPerPageComponent, renderLoaderOrData } from './RenderHelpers';

export type GetMedicineListPageProps = {
  backendService: IBackendService;
  dateFormatter: IDateFormatter;
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
  private updateInterval: NodeJS.Timeout | undefined = undefined;
  private loadDataTimeout: NodeJS.Timeout | undefined = undefined;
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
    await this.getMedicines(this.state.request, true);
    this.updateCurrentRequest();
  }

  componentWillUnmount(): void {
    clearTimeout(this.loadDataTimeout);
    clearInterval(this.updateInterval);
  }

  private async getMedicines(request: MedicineRequest, useLoadingTimeout: boolean) {
    if (useLoadingTimeout) {
      this.setState({
        loadingData: true,
        isInitialRequestMade: true,
        showPageCount: false
      });
    }
    const response = await this.backendService.getAllMedicines(request);
    const timeout = useLoadingTimeout ? this.loadingTimeout : 0;
    setTimeout(() => {
      this.setState({
        medicines: response.medicines,
        pages: response.pages,
        loadingData: false,
        showPageCount: true
      });
    }, timeout);
  }

  private async updateRequestAndFetch(request: Partial<MedicineRequest>, shouldWait: boolean) {
    this.setState({
      request: {
        ...this.state.request,
        ...request
      }
    });
    if (shouldWait) {
      clearTimeout(this.loadDataTimeout);
      this.loadDataTimeout = setTimeout(() => {
        this.getMedicines(this.state.request, true);
      }, 500);
      return;
    }
    setTimeout(() => {
      this.getMedicines(this.state.request, true);
    });
  }

  private resetRequestToDefaults() {
    this.setState({
      request: { ...this.defaultRequest }
    });
    setTimeout(() => {
      this.getMedicines(this.state.request, true)
        .then(() => {
          this.resetUpdateInterval();
        });
    });
  }

  private setPageCallback = (page: number) => {
    if (page === this.state.request.page) {
      return;
    }
    this.updateRequestAndFetch({ page }, false)
      .then(() => {
        this.resetUpdateInterval();
      });
  }

  private renderPageCountText() {
    return this.state.showPageCount ? `Avaliable pages: ${this.state.pages}` : 'Loading page count...';
  }


  private onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.updateRequestAndFetch({ itemsPerPage: parseInt(e.target.value) }, false)
      .then(() => {
        this.resetUpdateInterval();
      });
  }

  private onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, prop: "availableOnly" | "notExpired") => {
    const updatedProp: Partial<MedicineRequest> = {};
    updatedProp[prop] = e.target.checked;
    this.updateRequestAndFetch(updatedProp, false)
      .then(() => {
        this.resetUpdateInterval();
      });
  }

  private onTextChange = (e: React.ChangeEvent<HTMLInputElement>, prop: "manufacturer") => {
    const updatedProp: Partial<MedicineRequest> = {};
    updatedProp[prop] = e.target.value;
    this.updateRequestAndFetch(updatedProp, true)
      .then(() => {
        this.resetUpdateInterval();
      });
  }

  private onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedProp: Partial<MedicineRequest> = {};
    updatedProp["page"] = parseInt(e.target.value);
    this.updateRequestAndFetch(updatedProp, false)
      .then(() => {
        this.resetUpdateInterval();
      });
  }

  private updateCurrentRequest = () => {
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        this.getMedicines(this.state.request, false);
      }, 1000);
    }
  }

  private resetUpdateInterval = () => {
    setTimeout(() => {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
      this.updateCurrentRequest();
    });
  }

  render() {
    return (
      <div className='App-page'>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><input id='only-available-medicines' type="checkbox" checked={this.state.request.availableOnly} disabled={this.state.loadingData} onChange={(e) => this.onCheckboxChange(e, "availableOnly")} /></div>
            <label className='column' htmlFor='only-available-medicines'>Show only available medicines</label></div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><input id='only-not-expired-medicines' type="checkbox" checked={this.state.request.notExpired} disabled={this.state.loadingData} onChange={(e) => this.onCheckboxChange(e, "notExpired")} /></div>
            <label className='column' htmlFor='only-not-expired-medicines'>Show only not expired medicines</label></div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>Page</div>
            <div className='column'><input type="text" onChange={this.onPageChange} placeholder={'Page'} value={this.state.request.page} disabled={this.state.loadingData} /></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>Items Per Page</div>
            <div className='column'>{getItemsPerPageComponent(this.onSelectChange, this.state.request.itemsPerPage, this.state.loadingData)}</div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>Manufacturer</div>
            <div className='column'><input type="text" onChange={(e) => this.onTextChange(e, "manufacturer")} placeholder={'Manufacturer'} value={this.state.request.manufacturer} disabled={this.state.loadingData} /></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'><button onClick={this.resetRequestToDefaults} disabled={this.state.loadingData}>Reset to default request</button></div>
          </div>
        </div>
        <div className='App-page-row-setting'>
          <div className='row'>
            <div className='column'>{this.renderPageCountText()}</div>
          </div>
        </div>
        <div className='App-page-results'>
          {renderLoaderOrData(this.state.loadingData, this.state.isInitialRequestMade, this.state.medicines, this.props.dateFormatter, this.setPageCallback, this.state.pages, this.state.request.page)}
        </div>
      </div>
    )
  }
}