import React from 'react';
import { render } from '@testing-library/react';
import { PharmacyManagerApp } from './PharmacyManagerApp';
import { DependencyInjection } from '../base';
import { pages } from '../constants';
import { IAddMedicinePageStore, IBackendService, IDateFormatter, IGetDateTimeStore, IGetMedicineListPageStore, ILanguageSelectorStore, ILogManager, IPageRenderer, ITimeFormatter, ITranslationManager, Language } from '../types';
import { observable } from 'mobx';
import { HomePage, GetMedicineListPage, AddMedicinePage, UpdateMedicinePage } from './pages';
import { LogManager, PageRenderer } from '../services';

test('matches snapshot', () => {
  const services = (() => {
    const logManager: ILogManager = new LogManager();
    logManager.addLogger("PageRenderer")
    const pageRenderer: IPageRenderer = new PageRenderer(logManager.getLogger("PageRenderer"));
    const backendService: IBackendService = {
      addMedicine: jest.fn(),
      getAllMedicines: jest.fn(),
      getInitialPageCalculations: jest.fn(),
      getTranslations: jest.fn()
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
    const languageSelectorStore: ILanguageSelectorStore = {
      load: jest.fn(),
      unload: jest.fn(),
      selectLanguage: jest.fn(),
      language: observable.box(Language.English)
    };
    const translationManager: ITranslationManager = {
      loadTranslations: jest.fn(),
      getTranslation: jest.fn()
    }
    pageRenderer.add(pages.Home, <HomePage />);
    pageRenderer.add(pages.GetMedicinesList, <GetMedicineListPage dateFormatter={dateFormatter} store={getMedicineListPageStore} />);
    pageRenderer.add(pages.AddMedicines, <AddMedicinePage dateFormatter={dateFormatter} store={addMedicinePageStore} languageSelectorStore={languageSelectorStore} translationManager={translationManager} />);
    pageRenderer.add(pages.UpdateMedicines, <UpdateMedicinePage backendService={backendService} />);
    return {
      'IPageRenderer': pageRenderer,
      'IBackendService': backendService,
      'ILogManager': logManager,
      'IDateFormatter': dateFormatter,
      'ITimeFormatter': timeFormatter,
      'IGetMedicineListPageStore': getMedicineListPageStore,
      'IGetDateTimeStore': getDateTimeStore,
      'ILanguageSelectorStore': languageSelectorStore,
      'ITranslationManager': translationManager
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
