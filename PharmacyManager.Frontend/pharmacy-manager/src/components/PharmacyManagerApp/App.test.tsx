import React from 'react';
import { render } from '@testing-library/react';
import { PharmacyManagerApp } from './App';
import { BackendService } from '../../services/BackendService';

test('matches snapshot', () => {
  const comp = render(<PharmacyManagerApp backendService={new BackendService('')} />);
  expect(comp).toMatchSnapshot();
});
