import React from 'react';
import './App.css';
import { IBackendService } from '../../types';
import { GetMedicineListPage } from '../Pages/GetMedicineListPage/GetMedicineListPage';
import { pages } from './constants';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { AddMedicinePage } from '../Pages/AddMedicinePage/AddMedicinePage';

export type PharmacyManagerAppProps = {
  backendService: IBackendService;
}

export type PharmacyManagerAppState = {
}

export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps, PharmacyManagerAppState> {
  private readonly backendService: IBackendService;

  constructor(props: PharmacyManagerAppProps) {
    super(props);
    this.backendService = props.backendService;
  }

  private renderHomePage() {
    return <>Select one of the actions from the menu above</>;
  }

  private renderGetMedicineListPage() {
    return <GetMedicineListPage backendService={this.backendService} />;
  }

  private renderAddMedicinePage() {
    return <AddMedicinePage backendService={this.backendService}/>;
  }

  private renderUpdateMedicinePage() {
    return <>Update Medicine page coming soon</>;
  }
  
  render() {
    return (
      <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <div className='App-menu'>
              <Link to={`${pages.Home}`} className='App-menu-item'>Home</Link>
              <Link to={`${pages.GetMedicinesList}`} className='App-menu-item'>Get Medicine List</Link>
              <Link to={`${pages.AddMedicines}`} className='App-menu-item'>Add Medicine</Link>
              <Link to={`${pages.UpdateMedicines}`} className='App-menu-item'>Update Medicine</Link>
          </div>
          <div className='App-page-container'>
            <Routes>
              <Route path={`${pages.Home}`} element={this.renderHomePage()} />
              <Route path={`${pages.GetMedicinesList}`} element={this.renderGetMedicineListPage()} />
              <Route path={`${pages.AddMedicines}`} element={this.renderAddMedicinePage()} />
              <Route path={`${pages.UpdateMedicines}`} element={this.renderUpdateMedicinePage()} />
            </Routes>
          </div>
        </header>
      </BrowserRouter>
      </div>
    );
  }
}