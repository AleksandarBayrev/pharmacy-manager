import React from 'react';
import './App.css';
import { IBackendService, PageList } from '../../types';
import { GetMedicineListPage } from '../Pages/GetMedicineListPage/GetMedicineListPage';
import { Pages } from './constants';

export type PharmacyManagerAppProps = {
  backendService: IBackendService;
  activePage: PageList;
}

export type PharmacyManagerAppState = {
  activePage: PageList;
}

export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps, PharmacyManagerAppState> {
  private readonly backendService: IBackendService;

  constructor(props: PharmacyManagerAppProps) {
    super(props);
    this.backendService = props.backendService;
    this.state = {
      activePage: props.activePage
    }
  }

  private renderHomePage() {
    return <>Select one of the actions from the menu above</>;
  }

  private renderGetMedicineListPage() {
    return <GetMedicineListPage backendService={this.backendService} />;
  }

  private renderAddMedicinePage() {
    return <>Add Medicine page coming soon</>;
  }

  private renderUpdateMedicinePage() {
    return <>Update Medicine page coming soon</>;
  }

  private setActivePage(page: PageList) {
    this.setState({
      activePage: page
    });
    const finalUrlPath = Pages[page.replace("Page", "")];
    window.history.pushState(null, '', finalUrlPath);
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className='App-menu'>
            <div className='App-menu-item' onClick={() => this.setActivePage('HomePage')}>Home</div>
            <div className='App-menu-item' onClick={() => this.setActivePage('GetMedicineListPage')}>Get Medicine List</div>
            <div className='App-menu-item' onClick={() => this.setActivePage('AddMedicinePage')}>Add Medicine</div>
            <div className='App-menu-item' onClick={() => this.setActivePage('UpdateMedicinePage')}>Update Medicine</div>
          </div>
          <div className='App-page-container'>
            {(this as any)["render"+this.state.activePage]()}
          </div>
        </header>
      </div>
    );
  }
}