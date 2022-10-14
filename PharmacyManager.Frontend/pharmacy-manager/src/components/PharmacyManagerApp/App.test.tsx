import React from 'react';
import { render } from '@testing-library/react';
import { PharmacyManagerApp } from './App';
import { DependencyInjection } from '../../base';
import { PageRenderer } from '../../services/PageRenderer';
import { Logger } from '../../services/Logger';
import { pages } from './constants';
import { HomePage } from '../Pages/HomePage/HomePage';
import { GetMedicineListPage } from '../Pages/GetMedicineListPage/GetMedicineListPage';
import { AddMedicinePage } from '../Pages/AddMedicinePage/AddMedicinePage';
import { UpdateMedicinePage } from '../Pages/UpdateMedicinePage/UpdateMedicinePage';
import { IBackendService, IPageRenderer } from '../../types';

test('matches snapshot', () => {
  const services = (() => {
    const loggers = {
      pageRenderer: new Logger("PageRenderer")
    };
    const pageRenderer: IPageRenderer = new PageRenderer(loggers.pageRenderer);
    const backendService: IBackendService = {
      addMedicine: jest.fn(),
      getAllMedicines: jest.fn(),
      getInitialPageCalculations: jest.fn()
    };
    pageRenderer.add(pages.Home, <HomePage />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage backendService={backendService} />);
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage backendService={backendService}/>);
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage backendService={backendService} />);
    return {
      'IPageRenderer': pageRenderer
    }
  })();
  const DI: DependencyInjection = {
    getService: jest.fn((name) => {
      return (services as any)[name];
    }),
    registerService: jest.fn(),
    logger: jest.fn(),
    services: new Map(),
    serviceDescriptors: new Map(),
    getMessageForServiceFetching: jest.fn()
  } as any as DependencyInjection;
  const comp = render(<PharmacyManagerApp DependencyInjection={DI} />);
  expect(comp).toMatchSnapshot();
});
