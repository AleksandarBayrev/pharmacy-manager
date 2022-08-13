import React from 'react';
import './App.css';
import { IBackendService, MedicineRequest, MedicineResponse } from '../../types';

export type PharmacyManagerAppProps = {
  backendService: IBackendService
}

export type PharmacyManagerAppState = {
  request: MedicineRequest
  medicines: MedicineResponse[]
}

export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps, PharmacyManagerAppState> {
  private readonly backendService: IBackendService;
  private readonly defaultRequest: MedicineRequest = {
    availableOnly: false,
    notExpired: false,
    manufacturer: '',
    page: 1,
    itemsPerPage: 10
  };

  constructor(props: PharmacyManagerAppProps) {
    super(props);
    this.backendService = props.backendService;
    this.state = {
      request: { ...this.defaultRequest },
      medicines: []
    };
  }

  private async getMedicines(request: MedicineRequest) {
    this.setState({
      medicines: await this.backendService.getAllMedicines(request)
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
      <div className="App">
        <header className="App-header">
          <input type="text" onChange={(e) => this.updateRequest({page: parseInt(e.target.value)})} placeholder={'Page'} value={this.state.request.page} />
          <input type="text" onChange={(e) => this.updateRequest({itemsPerPage: parseInt(e.target.value)})} placeholder={'Items Per Page'} value={this.state.request.itemsPerPage} />
          <button onClick={async () => await this.getMedicines(this.state.request)}>Get medicines</button>
          <button onClick={() => this.resetRequestToDefaults()}>Reset to default request</button>
          <textarea readOnly={true} value={this.state.medicines.map(x => JSON.stringify(x)).join('\n')}></textarea>
        </header>
      </div>
    );
  }
}