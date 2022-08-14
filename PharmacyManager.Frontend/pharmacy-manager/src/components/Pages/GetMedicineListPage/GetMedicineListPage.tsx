import React from 'react';
import { IBackendService, MedicineModel, MedicineRequest, MedicineResponse } from '../../../types';
import "../../Shared/Styles.css";

export type GetMedicineListPageProps = {
  backendService: IBackendService;
}

export type GetMedicineListPageState = {
  request: MedicineRequest;
  medicines: MedicineModel[];
  pages: number;
  loadingData: boolean;
}

export class GetMedicineListPage extends React.Component<GetMedicineListPageProps, GetMedicineListPageState> {
  private readonly backendService: IBackendService;
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
      loadingData: false
    };
  }

  private async getMedicines(request: MedicineRequest) {
    this.setState({
      loadingData: true
    });
    this.backendService.getAllMedicines(request).then((medicinesResponse) => {
      this.setState({
        medicines: medicinesResponse.medicines,
        pages: medicinesResponse.pages,
        loadingData: false
      });
    }).catch((medicinesResponse) => {
      this.setState({
        medicines: medicinesResponse.medicines,
        pages: medicinesResponse.pages,
        loadingData: false
      });
    });
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
  render() {
    return (
      <div className='App-page'>
        <input type="text" onChange={(e) => this.updateRequest({ page: parseInt(e.target.value) })} placeholder={'Page'} value={this.state.request.page} />
        <input type="text" onChange={(e) => this.updateRequest({ itemsPerPage: parseInt(e.target.value) })} placeholder={'Items Per Page'} value={this.state.request.itemsPerPage} />
        <input type="text" onChange={(e) => this.updateRequest({ manufacturer: e.target.value })} placeholder={'Manufacturer'} value={this.state.request.manufacturer} />
        <button onClick={async () => await this.getMedicines(this.state.request)}>Get medicines</button>
        <button onClick={() => this.resetRequestToDefaults()}>Reset to default request</button>
        <input readOnly={true} value={`Avaliable pages: ${this.state.pages}`} />
        {this.state.loadingData ? <div className='App-data-loading'>Loading data, please wait...</div> :
          <textarea readOnly={true} value={this.state.medicines.map(x => JSON.stringify(x)).join('\n')}></textarea>}
      </div>
    )
  }
}