import React from 'react';
import './App.css';
import { IBackendService } from '../../types';
import { GetMedicineListPage } from '../Pages/GetMedicineListPage/GetMedicineListPage';
import { pages } from './constants';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AddMedicinePage } from '../Pages/AddMedicinePage/AddMedicinePage';
import { UpdateMedicinePage } from '../Pages/UpdateMedicinePage/UpdateMedicinePage';
import { DependencyInjection } from '../../base';
import { NotFoundPage } from '../Pages/NotFoundPage/NotFoundPage';

export type PharmacyManagerAppProps = {
  DependencyInjection: DependencyInjection;
}

export type PharmacyManagerAppState = {
}

export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps, PharmacyManagerAppState> {
  private renderHomePage() {
    return <>Select one of the actions from the menu above</>;
  }

  private renderGetMedicineListPage() {
    return <GetMedicineListPage backendService={this.props.DependencyInjection.getService<IBackendService>("IBackendService")} />;
  }

  private renderAddMedicinePage() {
    return <AddMedicinePage backendService={this.props.DependencyInjection.getService<IBackendService>("IBackendService")}/>;
  }

  private renderUpdateMedicinePage() {
    return <UpdateMedicinePage backendService={this.props.DependencyInjection.getService<IBackendService>("IBackendService")} />;
  }

  private renderNotFoundPage() {
    return <NotFoundPage />
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
              <Route path={`*`} element={this.renderNotFoundPage()} />
            </Routes>
          </div>
        </header>
      </BrowserRouter>
      </div>
    );
  }
}