import React from 'react';
import './PharmacyManagerApp.css';
import { pages } from '../constants';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { DependencyInjection } from '../base';
import { NotFoundPage } from './pages';
import { DateTime } from '../shared';
import { IPageRenderer, IGetDateTimeStore, IDateFormatter, ITimeFormatter, ITranslationManager, ISettingsStore, ValidURL, IAppStore } from '../types';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

export type PharmacyManagerAppProps = {
  DependencyInjection: DependencyInjection;
}

@observer
export class PharmacyManagerApp extends React.Component<PharmacyManagerAppProps> {
  private readonly pageRenderer = this.props.DependencyInjection.getService<IPageRenderer>("IPageRenderer");
  private readonly translationsManager = this.props.DependencyInjection.getService<ITranslationManager>("ITranslationManager");
  private readonly settingsStore = this.props.DependencyInjection.getService<ISettingsStore>("ISettingsStore");
  private readonly appStore: IAppStore = this.props.DependencyInjection.getService<IAppStore>("IAppStore");
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <div className='App-menu'>
              <Link to={`${pages.Home}`} className={`App-menu-item ${this.selectedClass}`}>{this.translationsManager.getTranslation(this.settingsStore.language.get(), "MENU_HOME")}</Link>
              <Link to={`${pages.GetMedicinesList}`} className={`App-menu-item ${this.selectedClass}`}>{this.translationsManager.getTranslation(this.settingsStore.language.get(), "MENU_GET_MEDICINE_LIST")}</Link>
              <Link to={`${pages.AddMedicines}`} className={`App-menu-item ${this.selectedClass}`}>{this.translationsManager.getTranslation(this.settingsStore.language.get(), "MENU_ADD_MEDICINE")}</Link>
              <Link to={`${pages.UpdateMedicines}`} className={`App-menu-item ${this.selectedClass}`}>{this.translationsManager.getTranslation(this.settingsStore.language.get(), "MENU_UPDATE_MEDICINE")}</Link>
              <Link to={`${pages.Settings}`} className={`App-menu-item ${this.selectedClass}`}>{this.translationsManager.getTranslation(this.settingsStore.language.get(), "MENU_SETTINGS")}</Link>
            </div>
          </header>
          <div className='App-page-container'>
            <div className='App-date-time'>
              <DateTime
                store={this.props.DependencyInjection.getService<IGetDateTimeStore>("IGetDateTimeStore")}
                dateFormatter={this.props.DependencyInjection.getService<IDateFormatter>("IDateFormatter")}
                timeFormatter={this.props.DependencyInjection.getService<ITimeFormatter>("ITimeFormatter")}
                phrase={this.translationsManager.getTranslation(this.settingsStore.language.get(), "CURRENT_TIME")} />
            </div>
            <div className='App-page'>
              <Routes>
                <Route path={`${pages.Home}`} element={this.pageRenderer.get(pages.Home)} />
                <Route path={`${pages.GetMedicinesList}`} element={this.pageRenderer.get(pages.GetMedicinesList)} />
                <Route path={`${pages.AddMedicines}`} element={this.pageRenderer.get(pages.AddMedicines)} />
                <Route path={`${pages.UpdateMedicines}`} element={this.pageRenderer.get(pages.UpdateMedicines)} />
                <Route path={`${pages.Settings}`} element={this.pageRenderer.get(pages.Settings)} />
                <Route path={`*`} element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  @computed
  private get selectedClass() {
    return window.location.pathname === this.appStore.currentPage.get() ? "App-menu-item-selected" : "";
  }
}