import React from 'react';
import { IDateFormatter, IGetMedicineListPageStore } from '../../../types';
import "../../../shared/Styles.css";
import { PageSettings } from './children/PageSettings';
import { PageResults } from './children/PageResults';

export type GetMedicineListPageProps = {
  dateFormatter: IDateFormatter;
  store: IGetMedicineListPageStore;
}

export class GetMedicineListPage extends React.Component<GetMedicineListPageProps> {
  async componentDidMount() {
    window.document.title = "Pharmacy Manager - Get Medicines";
    await this.props.store.load();
  }

  async componentWillUnmount() {
    await this.props.store.unload();
  }

  render() {
    return (
      <div className='App-page'>
        <div className="App-page-header">Get Medicine List</div>
        <PageSettings store={this.props.store} />
        <PageResults store={this.props.store} dateFormatter={this.props.dateFormatter} />
      </div>
    )
  }
}