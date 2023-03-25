import React from 'react';
import { render } from '@testing-library/react';
import { PharmacyManagerApp } from './PharmacyManagerApp';
import { DependencyInjection } from '../base';
import { pages } from '../constants';
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetDateTimeStore, IGetMedicineListPageStore, ILogManager, IPageRenderer, ITimeFormatter, ITranslationManager, Language, IAppStore } from '../types';
import { observable } from 'mobx';
import { HomePage, GetMedicineListPage, AddMedicinePage, UpdateMedicinePage } from './pages';
import { LogManager, PageRenderer } from '../services';
import { SettingsPage } from './pages/SettingsPage';

test('matches snapshot', () => {
  const services = (() => {
    const logManager: ILogManager = new LogManager();
    logManager.addLogger("PageRenderer")
    const appStore: IAppStore = {
      setCurrentPage: jest.fn(),
      currentPage: observable.box("/"),
      selectLanguage: jest.fn(),
      language: observable.box(Language.English),
      load: jest.fn(),
      unload: jest.fn()
    };
    const pageRenderer: IPageRenderer = new PageRenderer(logManager.getLogger("PageRenderer"));
    const backendService: IBackendService = {
      addMedicine: jest.fn(),
      getAllMedicines: jest.fn(),
      getInitialPageCalculations: jest.fn(),
      getTranslations: jest.fn(),
      reloadTranslations: jest.fn()
    };
    const dateFormatter: IDateFormatter = {
      getDateForInput: jest.fn(),
      getDateForTable: jest.fn(),
      getDateForDateTimeComponent: jest.fn()
    };
    const timeFormatter: ITimeFormatter = {
      getTimeForDateTimeComponent: jest.fn()
    };
    const getMedicineListPageStore: IGetMedicineListPageStore = {
      medicines: observable([]),
      showPageCount: observable.box(true),
      loadingData: observable.box(true),
      isLoadingPage: observable.box(false),
      request: {
        availableOnly: false,
        notExpired: false,
        page: 1,
        itemsPerPage: 10,
        manufacturer: ""
      },
      pages: observable.box(10),
      isInitialRequestMade: observable.box(false),
      defaultRequest: {
        availableOnly: false,
        notExpired: false,
        page: 1,
        itemsPerPage: 10,
        manufacturer: ""
      },
      load: jest.fn(),
      unload: jest.fn(),
      updateCurrentRequest: jest.fn(),
      resetUpdateInterval: jest.fn(),
      stopUpdateInterval: jest.fn(),
      getMedicines: jest.fn(),
      updateRequestProperties: jest.fn(),
      refetch: jest.fn(),
      resetRequestToDefaults: jest.fn()
    };
    const getDateTimeStore: IGetDateTimeStore = {
      load: jest.fn(),
      unload: jest.fn(),
      date: observable.box(new Date()),
      setDate: jest.fn()
    };
    const addMedicinePageStore: IAddMedicinePageStore = {
      isAddingMedicine: observable.box(false),
      isRequestSuccessful: observable.box(undefined),
      request: observable({
        name: "",
        manufacturer: "",
        description: "",
        manufacturingDate: new Date(),
        expirationDate: new Date(),
        price: "0",
        quantity: "0"
      }),
      load: jest.fn(),
      unload: jest.fn(),
      addMedicine: jest.fn(),
      resetMessage: jest.fn(),
      resetRequestToDefault: jest.fn(),
      updateRequest: jest.fn()
    };
    const translationManager: ITranslationManager = {
      loadTranslations: jest.fn(),
      reloadTranslations: jest.fn(),
      getTranslation: jest.fn()
    }
    pageRenderer.add(pages.Home, <HomePage translationManager={translationManager} appStore={appStore} />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage dateFormatter={dateFormatter} store={getMedicineListPageStore} translationManager={translationManager} appStore={appStore} />);
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage dateFormatter={dateFormatter} store={addMedicinePageStore}  translationManager={translationManager} appStore={appStore} />);
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage backendService={backendService} appStore={appStore} translationManager={translationManager} />);
    pageRenderer.add(pages.Settings, <SettingsPage translationManager={translationManager} appStore={appStore} />);
    return {
      'IPageRenderer': pageRenderer,
      'IBackendService': backendService,
      'ILogManager': logManager,
      'IDateFormatter': dateFormatter,
      'ITimeFormatter': timeFormatter,
      'IGetMedicineListPageStore': getMedicineListPageStore,
      'IGetDateTimeStore': getDateTimeStore,
      'ITranslationManager': translationManager,
      'IAppStore': appStore
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
