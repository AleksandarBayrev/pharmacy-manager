import React from 'react';
import { render } from '@testing-library/react';
import { PharmacyManagerApp } from './App';
import { DependencyInjection } from '../../base';

test('matches snapshot', () => {
  const DI: DependencyInjection = {
    getService: jest.fn(),
    registerService: jest.fn(),
    logger: jest.fn(),
    services: new Map(),
    serviceDescriptors: new Map(),
    getMessageForServiceFetching: jest.fn()
  } as any as DependencyInjection;
  const comp = render(<PharmacyManagerApp DependencyInjection={DI} />);
  expect(comp).toMatchSnapshot();
});
