import React from 'react';
import { IAppStore, IDateFormatter, IGetMedicineListPageStore, ISettingsStore, ITranslationManager } from '../../../types';
import "../../../shared/Styles.css";
import { PageSettings } from './children/PageSettings';
import { PageResults } from './children/PageResults';
import { computed, Lambda, observe } from 'mobx';
import { observer } from 'mobx-react';

export type GetMedicineListPageProps = {
  dateFormatter: IDateFormatter;
  store: IGetMedicineListPageStore;
  settingsStore: ISettingsStore;
  translationManager: ITranslationManager;
  appStore: IAppStore;
}

@observer
export class GetMedicineListPage extends React.Component<GetMedicineListPageProps> {
  private pageTitleObserver!: Lambda;
  componentDidMount = async () => {
    this.props.appStore.setCurrentPage(window.location.pathname);
    await this.props.settingsStore.load();
    this.pageTitleObserver = observe(this.props.settingsStore.language, () => {
        window.document.title = this.pageTitle;
    });
    window.document.title = "Pharmacy Manager - Get Medicines";
    await this.props.store.load();
  }

  componentWillUnmount = async () => {
    this.pageTitleObserver();
    await this.props.settingsStore.unload();
    await this.props.store.unload();
  }

  render() {
    return (
      <div className='App-page'>
        <div className="App-page-header">{this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "HEADER_GET_MEDICINE_LIST")}</div>
        <PageSettings store={this.props.store} SettingsStore={this.props.settingsStore} translationManager={this.props.translationManager} />
        <PageResults store={this.props.store} dateFormatter={this.props.dateFormatter} SettingsStore={this.props.settingsStore} translationManager={this.props.translationManager} />
      </div>
    )
  }

  @computed
  private get pageTitle() {
      return `Pharmacy Manager - ${this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "HEADER_GET_MEDICINE_LIST")}`;
  }
}