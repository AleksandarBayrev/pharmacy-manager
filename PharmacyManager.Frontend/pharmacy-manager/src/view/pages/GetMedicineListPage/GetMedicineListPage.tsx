import React from 'react';
import { IBackendService, IDateFormatter, IGetMedicineListPageStore } from '../../../types';
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
  }

  render() {
    console.log(this.props.store.request.manufacturer);
    return (
      <div className='App-page'>
        <PageSettings store={this.props.store} />
        <PageResults store={this.props.store} dateFormatter={this.props.dateFormatter} />
      </div>
    )
  }
}