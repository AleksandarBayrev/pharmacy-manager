import React from 'react';
import './App.css';
import { IPageRenderer } from '../../types';
import { pages } from './constants';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { DependencyInjection } from '../../base';
import { NotFoundPage } from '../Pages/NotFoundPage/NotFoundPage';

export type PharmacyManagerAppProps = {
  DependencyInjection: DependencyInjection;
}

export type PharmacyManagerAppState = {
}

export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps, PharmacyManagerAppState> {
  render() {
    const pageRenderer = this.props.DependencyInjection.getService<IPageRenderer>("IPageRenderer");
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
              <Route path={`${pages.Home}`} element={pageRenderer.get(pages.Home)} />
              <Route path={`${pages.GetMedicinesList}`} element={pageRenderer.get(pages.GetMedicinesList)} />
              <Route path={`${pages.AddMedicines}`} element={pageRenderer.get(pages.AddMedicines)} />
              <Route path={`${pages.UpdateMedicines}`} element={pageRenderer.get(pages.UpdateMedicines)} />
              <Route path={`*`} element={<NotFoundPage />} />
            </Routes>
          </div>
        </header>
      </BrowserRouter>
      </div>
    );
  }
}