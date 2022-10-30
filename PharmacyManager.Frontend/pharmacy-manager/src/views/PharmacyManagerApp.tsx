import React from 'react';
import './PharmacyManagerApp.css';
import { pages } from '../constants';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { DependencyInjection } from '../base';
import { NotFoundPage } from './pages';
import { DateTime } from '../shared';
import { IPageRenderer, IGetDateTimeStore, IDateFormatter, ITimeFormatter, ITranslationManager, ISettingsStore, ValidURL } from '../types';
import { observer } from 'mobx-react';

export type PharmacyManagerAppProps = {
  DependencyInjection: DependencyInjection;
}

@observer
export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps> {
  render() {
    const pageRenderer = this.props.DependencyInjection.getService<IPageRenderer>("IPageRenderer");
    const translationsManager = this.props.DependencyInjection.getService<ITranslationManager>("ITranslationManager");
    const settingsStore = this.props.DependencyInjection.getService<ISettingsStore>("ISettingsStore");
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <div className='App-menu'>
              <Link to={`${pages.Home}`} className={`App-menu-item ${this.getSelectedClass(pages.Home)}`}>{translationsManager.getTranslation(settingsStore.language.get(), "MENU_HOME")}</Link>
              <Link to={`${pages.GetMedicinesList}`} className={`App-menu-item ${this.getSelectedClass(pages.GetMedicinesList)}`}>{translationsManager.getTranslation(settingsStore.language.get(), "MENU_GET_MEDICINE_LIST")}</Link>
              <Link to={`${pages.AddMedicines}`} className={`App-menu-item ${this.getSelectedClass(pages.AddMedicines)}`}>{translationsManager.getTranslation(settingsStore.language.get(), "MENU_ADD_MEDICINE")}</Link>
              <Link to={`${pages.UpdateMedicines}`} className={`App-menu-item ${this.getSelectedClass(pages.UpdateMedicines)}`}>{translationsManager.getTranslation(settingsStore.language.get(), "MENU_UPDATE_MEDICINE")}</Link>
              <Link to={`${pages.Settings}`} className={`App-menu-item ${this.getSelectedClass(pages.Settings)}`}>{translationsManager.getTranslation(settingsStore.language.get(), "MENU_SETTINGS")}</Link>
            </div>
          </header>
          <div className='App-page-container'>
            <div className='App-date-time'>
              <DateTime
                store={this.props.DependencyInjection.getService<IGetDateTimeStore>("IGetDateTimeStore")}
                dateFormatter={this.props.DependencyInjection.getService<IDateFormatter>("IDateFormatter")}
                timeFormatter={this.props.DependencyInjection.getService<ITimeFormatter>("ITimeFormatter")}
                phrase={translationsManager.getTranslation(settingsStore.language.get(), "CURRENT_TIME")} />
            </div>
            <div className='App-page'>
              <Routes>
                <Route path={`${pages.Home}`} element={pageRenderer.get(pages.Home)} />
                <Route path={`${pages.GetMedicinesList}`} element={pageRenderer.get(pages.GetMedicinesList)} />
                <Route path={`${pages.AddMedicines}`} element={pageRenderer.get(pages.AddMedicines)} />
                <Route path={`${pages.UpdateMedicines}`} element={pageRenderer.get(pages.UpdateMedicines)} />
                <Route path={`${pages.Settings}`} element={pageRenderer.get(pages.Settings)} />
                <Route path={`*`} element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  private getSelectedClass = (url: ValidURL) => {
    return window.location.href.includes(url) ? "App-menu-item-selected" : "";
  }
}