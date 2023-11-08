import React from 'react';
import { render } from '@testing-library/react';
import { DependencyInjection } from '../base';
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetDateTimeStore, IGetMedicineListPageStore, ILogManager, IPageRenderer, ITimeFormatter, ITranslationManager, Language, IAppStore, Pages, IUpdateMedicinePageStore } from '../types';
import { observable } from 'mobx';
import { HomePage, GetMedicineListPage, AddMedicinePage, UpdateMedicinePage } from './pages';
import { LogManager, PageRenderer } from '../services';
import { SettingsPage } from './pages/SettingsPage';
import { TranslationsMock } from '../mocks/TranslationsMock';

test('matches snapshot', async () => {
  window.pharmacyManagerConfiguration = {
    baseApiUrl: "",
    appLoadedEventName: "APP_LOADED",
    appDivId: "root",
    showLogo: false
  };
  const { pages } = await import('../constants');
  const { PharmacyManagerApp } = await import('./PharmacyManagerApp');
  const services = ((pages: Pages) => {
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
      reloadTranslations: jest.fn(),
      deleteMedicine: jest.fn(),
      updateMedicine: jest.fn(),
      getMedicine: jest.fn()
    };
    const dateFormatter: IDateFormatter = {
      getDateForInput: jest.fn((date) => "01.01.2023"),
      getDateForTable: jest.fn((date) => "01.01.2023"),
      getDateForDateTimeComponent: jest.fn((date) => "01.01.2023")
    };
    const timeFormatter: ITimeFormatter = {
      getTimeForDateTimeComponent: jest.fn((time) => "00:00")
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
      additionalMessage: observable.box(""),
      load: jest.fn(),
      unload: jest.fn(),
      updateCurrentRequest: jest.fn(),
      resetUpdateInterval: jest.fn(),
      stopUpdateInterval: jest.fn(),
      getMedicines: jest.fn(),
      updateRequestProperties: jest.fn(),
      refetch: jest.fn(),
      resetRequestToDefaults: jest.fn(),
      deleteMedicine: jest.fn(),
      totalCount: observable.box(0),
      totalFilteredCount: observable.box(0),
      fetchingError: observable.box(false)
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
    const updateMedicinePageStore: IUpdateMedicinePageStore = {
      isUpdatingMedicine: observable.box(false),
      isRequestSuccessful: observable.box(undefined),
      isLoadingMedicine: observable.box(false),
      request: observable({
        id: "",
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
      updateMedicine: jest.fn(),
      resetMessage: jest.fn(),
      resetRequestToDefault: jest.fn(),
      updateRequest: jest.fn()
    };
    const translationManager: ITranslationManager = {
      loadTranslations: jest.fn(),
      reloadTranslations: jest.fn(),
      getTranslation: jest.fn((language, key) => (TranslationsMock[language] as any)[key])
    }
    pageRenderer.add(pages.Home, <HomePage translationManager={translationManager} appStore={appStore} />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage dateFormatter={dateFormatter} store={getMedicineListPageStore} translationManager={translationManager} appStore={appStore} />);
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage dateFormatter={dateFormatter} store={addMedicinePageStore}  translationManager={translationManager} appStore={appStore} />);
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage backendService={backendService} appStore={appStore} dateFormatter={dateFormatter} translationManager={translationManager} store={updateMedicinePageStore} />);
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
      'IAppStore': appStore,
      'IUpdateMedicinePageStore': updateMedicinePageStore,
      'IAddMedicinePageStore': addMedicinePageStore
    }
  });
  const DI: DependencyInjection = {
    getService: jest.fn((name) => {
      return (services(pages) as any)[name];
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
