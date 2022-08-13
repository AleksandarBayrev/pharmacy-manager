import React from 'react';
import { render } from '@testing-library/react';
import { PharmacyManagerApp } from './App';
import { BackendService } from '../../services/BackendService';

test('renders learn react link', () => {
  const comp = render(<PharmacyManagerApp backendService={new BackendService('')} activePage={"HomePage"} />);
  expect(comp).toMatchSnapshot();
});